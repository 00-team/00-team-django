from django.urls import path

from . import views

urlpatterns = [
    path("login/google/", views.authorize, name="google-authorize"),
    path("login/google_callback/", views.google_callback, name="google-callback"),
]