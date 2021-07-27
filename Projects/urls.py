from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_projects, name='Projects'),
    path('p/<slug:slug>/', views.get_project, name='Project'),
    path('modify_star/', views.modify_star, name='Modify Star'),
    path('stars/', views.get_stars, name='Get Star'),
]
