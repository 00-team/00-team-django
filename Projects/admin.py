from django.contrib import admin

from .models import Project, Star, DocumentVideos, DocumentImages

admin.site.register(Project)
admin.site.register(Star)
admin.site.register(DocumentVideos)
admin.site.register(DocumentImages)