import requests, json

from django.utils.crypto import get_random_string

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_GET

from django.core.exceptions import PermissionDenied

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse

from django.conf import settings
GOOGLE = settings.GOOGLE

from django.contrib.auth import login, logout, authenticate

from django.contrib.auth.models import User
from .models import UserAccount
from Projects.models import Star


def BodyLoader(data):
    try:
        return json.loads(data)
    except Exception:
        return None


@require_GET
def authorize(request):
    if request.GET.get("next"):
        request.session["next"] = request.GET.get("next")

    if request.user.is_authenticated:
        logout(request)

    google_auth = "https://accounts.google.com/o/oauth2/v2/auth"
    scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"

    state = get_random_string(length=20)
    request.session["google_state"] = state

    url = google_auth + f"?redirect_uri={GOOGLE['redirect_uri']}&response_type=code&scope={scope}&state={state}&client_id={GOOGLE['client_id']}"

    return HttpResponseRedirect(url)


@require_GET
def google_callback(request):
    if request.GET.get("state") != request.session.get("google_state"):
        raise PermissionDenied
    
    if "code" in request.GET:
        code = request.GET["code"]

        url = f"https://oauth2.googleapis.com/token?code={code}&client_id={GOOGLE['client_id']}&client_secret={GOOGLE['client_secret']}&redirect_uri={GOOGLE['redirect_uri']}&grant_type=authorization_code"

        response = requests.post(url)
        if response.status_code != 200:
            raise PermissionDenied
        
        response = response.json()
        access_token = response.get("access_token")

        url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"

        response = requests.get(url)
        if response.status_code != 200:
            raise PermissionDenied
        
        response = response.json()
        if not response.get("verified_email"):
            raise PermissionDenied

        email = response.get("email")
        picture = response.get("picture")
        name = response.get("name")
        locale = response.get("locale")

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)            
        else:
            username = email.replace("@", "-")
            username = username.replace(".", "-")
            user = User.objects.create_user(username, email, get_random_string(length=20))


        if UserAccount.objects.filter(user=user).exists():
            user_account = UserAccount.objects.get(user=user)
            user_account.picture = picture
            user_account.nickname = name
            user_account.locale = locale
            user_account.change_token()
        else:
            user_account = UserAccount(
                user=user,
                picture=picture,
                nickname=name,
                locale=locale)
            
            user_account.change_token()
        
        login(request, user)
        url = "/"

        if request.session.get("next"):
            url = request.session["next"]

        return HttpResponseRedirect(url)
    else:
        raise PermissionDenied


def logout_user(r):
    if r.method == 'POST':
        try:
            logout(r)
            return JsonResponse({'success': 'User successfully logouted'})
        except Exception as e:
            return JsonResponse({'Error': str(e)})
    elif r.method == 'GET':
        try:
            logout(r)
            if r.GET.get('next'):
                return HttpResponseRedirect(r.GET.get('next'))
            else:
                return HttpResponseRedirect('/')

        except Exception as e:
            return HttpResponse(str(e))

    else:
        return HttpResponseRedirect("/")


@require_POST
def login_user(r):
    if r.user.is_authenticated:
        logout(r)

    data = BodyLoader(r.body)
    
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        login(r, user)
        return JsonResponse({'success': 'successfully logined'})
    else:
        return JsonResponse({'Error': 'Username and password not match'})
    


def change_password(r):
    return JsonResponse({'1c':1})


@require_GET
def account(r):
    user = r.user
    user_data = None

    if user.is_authenticated:
        if UserAccount.objects.filter(user=user).exists():
            ua = UserAccount.objects.get(user=user)

            stared_projects = []

            for s in Star.objects.filter(user=user):
                p = s.project
                stared_projects.append({
                    'id': p.id,
                    'name': p.name,
                    'slug': p.slug,
                })

            if not ua.token:
                ua.change_token()

            user_data = {
                'username': user.username,
                'nickname': ua.nickname,
                'email': user.email,
                'picture': ua.picture,
                'token': ua.token,
                'stared_projects': stared_projects,
            }

        else:
            return HttpResponseRedirect('/api/account/login/google/?next=/account/')

    
    return JsonResponse({'user': user_data})
    


@require_POST
def change_info(r):
    user = r.user
    data = BodyLoader(r.body)
    if not data:
        return JsonResponse({'error': 'Body is empty'}, status=400)
    
    return JsonResponse({'username': user.username})

