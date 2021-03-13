import datetime
from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=30, default="No Name")
    description = models.TextField(default="No Description")
    video = models.FileField(upload_to="Projects/video/")
    thumbnail = models.FileField(upload_to="Projects/thumbnail/")
    date_start = models.DateTimeField(default=datetime.datetime.now())
    stars = models.IntegerField(default=0)
    language = models.CharField(max_length=30, default="No Language")
    workspace = models.CharField(max_length=40, default="No Work Space")
    private = models.CharField(
        max_length = 2,
        choices = [("PR", "Private"), ("PB", "Public")],
        default = "PB",
    )
    slug = models.SlugField(max_length=30, unique=True)
    git = models.URLField(default="https://github.com/00-team")
    shop = models.CharField(max_length=200, default="/shop/projects/")


    def delete(self, using=None, keep_parents=False):
        self.video.storage.delete(self.video.name)
        self.thumbnail.storage.delete(self.thumbnail.name)
        super().delete()

    def __str__(self):
        return self.name
