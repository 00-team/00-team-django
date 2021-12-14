from django.urls import path

from . import views

urlpatterns = [
    path('', views.account, name='Account View'),
    path('sprojects/', views.stared_projects, name='Stared Projects'),
    path('login/', views.login, name='Login'),
    path('register/', views.register, name='Register'),
    path('verify_code/', views.verify_code, name='verify code'),
    path('login/google/', views.authorize, name='Google Authorize'),
    path('login/google_callback/', views.google_callback, name='Google Callback'),
    path('logout/', views.logout, name='logout'),
    path('change_password/', views.change_password, name='Change Password'),
    path('change_info/', views.change_info, name='Change Informarion'),
    path('change_picture/', views.change_picture, name='Change Picture'),
]
