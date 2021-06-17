from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_projects, name='Projects'),
    path('p/<slug:slug>/', views.project_view, name='Project'),
    path('modify_star/', views.modify_star, name='Modify Star'),
]