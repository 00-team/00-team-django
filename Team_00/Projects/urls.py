from django.urls import path

from . import views

urlpatterns = [
    path("", views.projects, name="Projects"),
    path("p/<slug:slug>/", views.project, name="Project"),
]