import requests, json, string

from django.contrib.auth import login as system_login, logout as system_logout, authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import EmailValidator
from django.db.models.signals import pre_delete
from django.db import IntegrityError
from django.dispatch import receiver
from django.http import HttpResponseRedirect, JsonResponse
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from django.middleware.csrf import get_token


from Account.models import UserAccount, UserTemp
from Projects.models import Project, Star, DocumentImages, DocumentVideos

from .decorators import login_required

GOOGLE = settings.GOOGLE

def CheckTmeps():
    for ut in UserTemp.objects.all():
        ut.check_time

def ValidPassword(password) -> str:
    if password:
        if type(password) == str:
            if len(password) > 7:
                if len(password) < 4096:
                    return password
    
    return None

def ValidUsername(username) -> str:
    if username:
        if type(username) == str:
            if len(username) > 4:
                if len(username) < 150:
                    for c in username:
                        if c not in (string.ascii_letters + string.digits + '_'):
                            return None
                    return username
    return None

def GetOrMakeUA(user: User) -> UserAccount:
    try:
        return UserAccount.objects.get(user=user)
    except UserAccount.DoesNotExist:
        ua = UserAccount(user=user)
        ua.save()
        return ua

def BodyLoader(body):
    try:
        return json.loads(body)
    except Exception:
        return {}

def NextPath(r):
    data = {}

    if r.method == 'GET':
        data = r.GET
    elif r.method == 'POST':
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)
    
    if data.get('next'):
        return data.get('next')
    elif r.session.get('next'):
        return r.session.get('next')
    
    return '/'

def RequestData(response):
    try:
        return response.json()
    except Exception:
        return {
            'error': 'can`t get data'
        }

def googleRedirect(r):
    return f'{r.scheme}://{r.get_host()}' + GOOGLE['redirect_uri']


@require_GET
def authorize(r):
    r.session['next'] = NextPath(r)

    google_auth = 'https://accounts.google.com/o/oauth2/v2/auth'
    scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

    state = get_random_string(length=20)
    r.session['google_state'] = state

    url = google_auth + f"?redirect_uri={googleRedirect(r)}&response_type=code&scope={scope}&state={state}&client_id={GOOGLE['client_id']}"

    return HttpResponseRedirect(url)


@require_GET
def google_callback(r):
    if r.user.is_authenticated:
        system_logout(r)

    if r.GET.get('state') != r.session.get('google_state'):
        return JsonResponse({'Error': 'state not valid'}, status=403)
    
    code = r.GET.get('code')

    url = f"https://oauth2.googleapis.com/token?code={code}&client_id={GOOGLE['client_id']}&client_secret={GOOGLE['client_secret']}&redirect_uri={googleRedirect(r)}&grant_type=authorization_code"

    res = RequestData(requests.post(url))
    access_token = res.get('access_token')

    if not access_token:
        return JsonResponse(res)

    url = f'https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}'

    res = RequestData(requests.get(url))

    if not res.get('verified_email'):
        return JsonResponse(res)

    email = res.get('email')
    picture = res.get('picture')
    name = res.get('name')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        while True:
            try:
                user = User.objects.create_user(username=get_random_string(length=20), email=email)
                break
            except IntegrityError:
                continue
    
    ua = GetOrMakeUA(user)
    ua.nickname = name
    ua.get_picture(picture)
    ua.save()
    
    system_login(r, user)

    return HttpResponseRedirect(NextPath(r))


@require_GET
def logout(r):
    try:
        system_logout(r)
        return HttpResponseRedirect(NextPath(r))
    except Exception:
        return HttpResponseRedirect('/')


@require_POST
def login(r):
    if r.user.is_authenticated:
        system_logout(r)
    
    data = {}
    
    if r.POST:
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)


    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        GetOrMakeUA(user)
        system_login(r, user)
            
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'error': 'Username and password not match', 'status':'error'}, status=405)
    

@require_POST
def register(r):
    CheckTmeps()

    if r.user.is_authenticated:
        system_logout(r)
    
    data = {}
    
    if r.POST:
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)
    

    email = data.get('email')
    username = ValidUsername(data.get('username'))
    password = ValidPassword(data.get('password'))

    if not password:
        return JsonResponse({'error': 'your password is not valid'}, status=403)
    
    if not username:
        return JsonResponse({'error': 'your username is not valid'}, status=403)


    try:
        validator = EmailValidator(allowlist=['gmail'])
        validator(email)
    except ValidationError:
        return JsonResponse({'error':'your emal addr is not valid'}, status=403)

    
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error':'you have account with this email'}, status=403)
    

    if UserTemp.objects.filter(email=email).exists():
        return JsonResponse({'error':'we send a code for your email pls verify your code'}, status=406)

    
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'this username is exists'}, status=403)
    

    ut = UserTemp(
        username=username,
        password=password,
        email=email
    )

    ut.save()

    send_mail(
        subject='00 Team Verify Code',
        message=f'msg code: {ut.code}',
        html_message=f'msg <p style="color:red;">{ut.code}</p>',
        from_email=None,
        recipient_list=[email],
        fail_silently=True,
    )

    return JsonResponse({'success': 'we sand a email for you. pls read and verify your account'})



@require_POST
def verify_code(r):
    CheckTmeps()

    if r.user.is_authenticated:
        system_logout(r)
    
    data = {}
    
    if r.POST:
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)
    

    email = data.get('email')
    code = data.get('code')

    try:
        ut = UserTemp.objects.get(email=email, code=code)
    except UserTemp.DoesNotExist:
        return JsonResponse({'error':'your data is not valid'}, status=403)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(ut.username, ut.email, ut.password)
    
    system_login(r, user)
    ut.delete()

    return JsonResponse({'success':'Successfully logined'})


@login_required
def account(r):
    user = r.user
    ua = GetOrMakeUA(user)

    user_data = {
        'username': user.username,
        'nickname': ua.nickname or 'No Name',
        'email': user.email,
        'picture': ua.picture.url if ua.picture else None, # js: ua.picture ? ua.picture.url : null
        'token': ua.token,
    }
    
    return JsonResponse({'user': user_data})


@login_required
def stared_projects(r):
    def gt(p):
        pdv = DocumentVideos.objects.filter(project=p).last()
        pdi = DocumentImages.objects.filter(project=p).last()

        if pdv:
            return pdv.thumbnail.url
        elif pdi:
            return pdi.image.url
        
        return None


    sp = list(map(
        lambda s : {
            'id': s.project.id,
            'name': s.project.name,
            'slug': s.project.slug,
            'thumbnail': gt(s.project),
            'lang': s.project.language,
            'wspace': s.project.workspace,
        },
        Star.objects.filter(user=r.user)
    ))

    return JsonResponse({'stared_projects': sp})


@require_POST
@login_required
def change_info(r):
    user = r.user
    data = {}

    if r.POST:
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)

    username = str(data.get('username'))[:100]
    nickname = str(data.get('nickname'))[:50]
    
    ua = GetOrMakeUA(user)

    if nickname:
        ua.nickname = nickname
        ua.save()

    if len(username) > 4:
        for x in username:
            if x not in (string.ascii_letters + string.digits + '_'):
                return JsonResponse({'error': 'username is not valid'}, status=400)
        
        try:
            user.username = username
            user.save()
        except IntegrityError:
            return JsonResponse({'error': 'this username is exists'}, status=400)

    return JsonResponse({'success': 'Your Info Changed Successfully', 'username': user.username, 'nickname': ua.nickname})


@require_POST
@login_required
def change_password(r):
    user = r.user
    data = {}

    if r.POST:
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)
    
    password = data.get('password')

    if type(password) != str:
        return JsonResponse({'error':'Send a valid password'}, status=406)
    
    if len(password) > 4096:
        return JsonResponse({'error':'your password is too long'}, status=406)
    
    if len(password) < 8:
        return JsonResponse({'error':'your password is too short'}, status=406)
    
    try:
        user.set_password(password)
        user.save()
    except Exception:
        return JsonResponse({'error':'we cant save this password for you'}, status=400)

    return JsonResponse({'success': 'your password successfully changed'})


@receiver(pre_delete, sender=UserAccount)
def delete_images(sender, instance, **kwargs):
    if instance.picture:
        instance.picture.storage.delete(instance.picture.name)