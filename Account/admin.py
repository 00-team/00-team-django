from django.contrib import admin

from .models import UserAccount, UserTemp

@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'nick', 'email')
    list_per_page = 15

    @admin.display(description='Nickname')
    def nick(self, obj):
        return obj.nickname or 'No Name'
    

    @admin.display
    def email(self, o):
        return o.user.email or 'No Mail'


@admin.register(UserTemp)
class UserTempAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'code', 'check_time')
    list_per_page = 15
