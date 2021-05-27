from django.urls import path

from . import views

urlpatterns = [
    path("", views.account_view, name="account view"),
    path("login/", views.login_user, name="Login"),
    path("login/google/", views.authorize, name="google authorize"),
    path("login/google_callback/", views.google_callback, name="google callback"),
    path("logout", views.logout_user, name="logout"),
    path("change_password/", views.change_password, name="Change Password"),
]