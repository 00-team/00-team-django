from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(default="No Description")
    video = models.FileField(upload_to="Projects/video/")
    thumbnail = models.FileField(upload_to="Projects/thumbnail/")
    
    def delete(self, using=None, keep_parents=False):
        self.video.storage.delete(self.video.name)
        self.thumbnail.storage.delete(self.thumbnail.name)
        super().delete()

    def __str__(self):
        return self.name
