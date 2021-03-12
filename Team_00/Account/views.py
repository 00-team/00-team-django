import requests

from django.shortcuts import render

from django.utils.crypto import get_random_string

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_GET


from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse


@require_GET
def authorize(request):
    session = request.session

    google_auth = "https://accounts.google.com/o/oauth2/v2/auth"
    
    redirect_uri = "http://localhost:8000/account/login/google_callback/"
    scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    client_id = "367011827533-a5csretcdjb5fojbs8m189qvejrp2vn0.apps.googleusercontent.com"

    state = get_random_string(length=20)
    request.session["google_state"] = state

    url = google_auth + f"?redirect_uri={redirect_uri}&response_type=code&scope={scope}&state={state}&client_id={client_id}"

    return HttpResponseRedirect(url)

    # if request.session.get("user_token"):
    #     return HttpResponseRedirect("/profile/")
    # else:
    #     twitch_app = KeplerAppsConfig.objects.get(name="Twitch")



@require_GET
def google_callback(request):
    if request.GET.get("state") != request.session.get("google_state"):
        return HttpResponse("Error 403, state not True")
    
    if "error" in request.GET:
        error_text = request.GET["error"] 
        return HttpResponse(f"<h1>{error_text}</h1>")
    
    if "code" in request.GET:
        google_token = "https://oauth2.googleapis.com/token"
        code = request.GET["code"]
        client_id = "367011827533-a5csretcdjb5fojbs8m189qvejrp2vn0.apps.googleusercontent.com"
        client_secret = "-DC6As08B_PdkbyofQXJpUPq"
        redirect_uri = "http://localhost:8000/account/login/google_callback/"

        url = google_token + f"?code={code}&client_id={client_id}&client_secret={client_secret}&redirect_uri={redirect_uri}&grant_type=authorization_code"

        response = requests.post(url)
        if response.status_code != 200:
            return HttpResponse("Error get google token")
        
        response = response.json()

        access_token = response["access_token"]

        url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"

        response = requests.get(url)
        if response.status_code != 200:
            return HttpResponse("Error get email")
        
        response = response.json()
        if not response["verified_email"]:
            return HttpResponse("Error 403 we need verified email google account for sing-up you")

        email = response.get("email")
        picture = response.get("picture")
        name = response.get("name")
        locale = response.get("locale")

        return JsonResponse(response.json())


