from django.shortcuts import render

from django.http import HttpResponse

from django.template import loader

from Projects.models import Project

from django.views.decorators.http import require_GET


@require_GET
def index(request):
    last_project = Project.objects.last()
    c = {}
    if last_project:
        c = {
            "last_project": {
                "name": last_project.name,
                "description": last_project.description,
                "video": last_project.video.url,
                "thumbnail": last_project.thumbnail.url
            }
        }

    template = loader.get_template("index.html")
    return HttpResponse(template.render(c, request))