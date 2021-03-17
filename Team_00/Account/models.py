from django.db import models
from django.db import IntegrityError

from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

import string

class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    picture = models.URLField()
    locale = models.CharField(max_length=10)
    token = models.CharField(max_length=50, null=True, blank=True, unique=True)

    def change_token(self):
        try:
            self.token = get_random_string(50, string.ascii_letters + string.digits + "!@#$%^&*")
        except IntegrityError:
            self.change_token()

    def __str__(self):
        return self.name