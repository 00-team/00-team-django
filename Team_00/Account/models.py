from django.db import models
from django.contrib.auth.models import User

class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    picture = models.URLField()
    locale = models.CharField(max_length=10)

    def __str__(self):
        return self.name