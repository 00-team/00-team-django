from django.test import TestCase
from .models import Project

class ProjectTestCase(TestCase):
    def setUp(self):
        Project.objects.create(
            name="Project 1",
            description="roar",
            video = open("video.mp4", "w"),
            thumbnail = open("thumbnail.png", "w")
        )