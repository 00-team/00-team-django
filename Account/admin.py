from django.contrib import admin

from .models import UserAccount, UserTemp

admin.site.register(UserAccount)
admin.site.register(UserTemp)