import string, requests

from django.db import models
from django.db import IntegrityError

from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile


class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50, blank=True)
    picture = models.ImageField(upload_to='Accounts/Pictures/', null=True, blank=True)
    token = models.CharField(max_length=70, null=True, blank=True, unique=True)

    def change_token(self):
        try:
            self.token = get_random_string(70, string.ascii_letters + string.digits + '!@#$%^&*')
            self.save()
        except IntegrityError:
            self.change_token()
    
    def get_picture(self, url: str):
        if url[-5:] == 's96-c':
            url = url[:-5] + 's500-c'
        
        r = requests.get(url, stream=True)
        if r.status_code != 200:
            return
        
        tf = NamedTemporaryFile()

        for c in r.iter_content(1024 * 8):
            tf.write(c)
        
        self.picture.save(f'pp-{self.user.username}-{self.id}-{self.nickname}.png', File(tf))
        self.save()
        
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.change_token()
        super(UserAccount, self).save(*args, **kwargs)

    def __str__(self):
        return self.nickname or str(self.user)
