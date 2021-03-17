import datetime, string

from django.db import models
from django.db import IntegrityError

from django.utils.crypto import get_random_string

from django.contrib.auth.models import User


class Project(models.Model):
    name = models.CharField(max_length=30, default="No Name")
    description = models.TextField(default="No Description")
    video = models.FileField(upload_to="Projects/video/")
    thumbnail = models.ImageField(upload_to="Projects/thumbnail/")

    date_start = models.DateTimeField(default=datetime.datetime.now())
    language = models.CharField(max_length=30, default="No Language")
    workspace = models.CharField(max_length=40, default="No Work Space")
    private = models.CharField(
        max_length = 2,
        choices = [("PR", "Private"), ("PB", "Public")],
        default = "PB",
    )
    slug = models.SlugField(null=True, blank=True, unique=True)
    git = models.URLField(default="https://github.com/00-team")
    shop = models.CharField(max_length=200, default="/shop/projects/")


    def delete(self, using=None, keep_parents=False):
        self.video.storage.delete(self.video.name)
        self.thumbnail.storage.delete(self.thumbnail.name)
        super().delete()
    
    def save(self, *args, **kwargs):
        try:
            print(self.video)
            if not self.slug:
                self.slug = get_random_string(15, string.ascii_letters + string.digits +"-")
            super().save(*args, **kwargs)
        except IntegrityError:
            self.save(*args, **kwargs)

    def __str__(self):
        return self.name


class Star(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username + " - " + self.project.name