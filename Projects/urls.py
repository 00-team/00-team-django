from django.urls import path

from . import views

urlpatterns = [
    path("", views.projects, name="Projects"),
    path("p/<slug:slug>/", views.project, name="Project"),
    path("modify-star/", views.modify_star, name="Modify Star"),
]