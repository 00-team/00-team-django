import requests

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

from django.contrib.auth import login, logout

from django.contrib.auth.models import User
from .models import UserAccount


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
            user = User.objects.create_user(username, email, get_random_string(length=16))
            user.save()


        if UserAccount.objects.filter(user=user).exists():
            user_account = UserAccount.objects.get(user=user)
            user_account.picture = picture
            user_account.name = name
            user_account.locale = locale
            user_account.change_token()
            user_account.save()
        else:
            user_account = UserAccount.objects.create(
                user=user,
                picture=picture,
                name=name,
                locale=locale)
            
            user_account.change_token()
            user_account.save()
        
        login(request, user)
        url = "/account/"

        if request.session.get("next"):
            url = request.session["next"]

        return HttpResponseRedirect(url)
    else:
        raise PermissionDenied


@require_GET
def logout_user(request):
    logout(request)
    return HttpResponseRedirect("/")


def login_user(r):
    return JsonResponse({'1':1})


def change_password(r):
    return JsonResponse({'1c':1})


@require_GET
def account_view(request):
    user = request.user
    c = {}

    return JsonResponse({'test':1})
    """
    if user.is_authenticated:
        if not UserAccount.objects.filter(user=user).exists():
            return HttpResponseRedirect("/account/login/google/")

        user_account = UserAccount.objects.get(user=user)
        c["user_data"] = {
            "email": user.email,
            "username": user.username,
            "name": user_account.name,
            "picture": user_account.picture
        }
        template = loader.get_template("account.html")
        return HttpResponse(template.render(c, request))
    else:
        return HttpResponseRedirect("/account/login/google/")
    
    """
