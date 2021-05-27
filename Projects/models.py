import datetime, string

from django.db import models
from django.db import IntegrityError

from django.utils.crypto import get_random_string

from django.contrib.auth.models import User


class Project(models.Model):
    name = models.CharField(max_length=30, default="No Name")
    description = models.TextField(default="No Description")
    date_start = models.DateTimeField(default=datetime.datetime.now())
    language = models.CharField(max_length=30, default="No Language")
    workspace = models.CharField(max_length=40, default="No Work Space")
    status = models.CharField(
        max_length = 2,
        choices = [("PR", "Private"), ("PB", "Public")],
        default = "PB",
    )
    slug = models.SlugField(null=True, blank=True, unique=True)
    git = models.URLField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        try:
            if not self.slug:
                self.slug = get_random_string(15, string.ascii_letters + string.digits + "-")
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


class DocumentVideos(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    video = models.FileField(upload_to="Projects/DocumentVideos/video/")
    thumbnail = models.ImageField(upload_to="Projects/DocumentVideos/thumbnail/")

    def __str__(self):
        return self.project.name + " - Document Video"


class DocumentImages(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="Projects/DocumentImages/")

    def __str__(self):
        return self.project.name + " - Document Image"