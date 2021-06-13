import requests, json, string

from django.contrib.auth import login as system_login, logout as system_logout, authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from Account.models import UserAccount
from Projects.models import Project, Star, DocumentImages, DocumentVideos

from .decorators import login_required

GOOGLE = settings.GOOGLE

def GetOrMakeUA(user: User) -> UserAccount:
    try:
        return UserAccount.objects.get(user=user)
    except UserAccount.DoesNotExist:
        return UserAccount(user=user).save()


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
        
    try:
        ua = UserAccount.objects.get(user=user)
        if not ua.picture:
            ua.picture = picture
        if not ua.nickname:
            ua.nickname = name

        ua.save()
    except UserAccount.DoesNotExist:
        ua = UserAccount(user=user, picture=picture, nickname=name)
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
            
        return JsonResponse({'success': 'successfully logined'})
    else:
        return JsonResponse({'error': 'Username and password not match'})
    

@login_required
def account(r):
    user = r.user
    ua = GetOrMakeUA(user)

    user_data = {
        'username': user.username,
        'nickname': ua.nickname or 'No Name',
        'email': user.email,
        'picture': ua.picture,
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


def change_password(r):
    return JsonResponse({'1c':1})