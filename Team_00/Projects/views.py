from django.shortcuts import render

from django.http import HttpResponse

from django.template import loader

from Projects.models import Project

from django.views.decorators.http import require_GET


@require_GET
def projects(request):
    all_projects = Project.objects.all()
    c = {}
    if all_projects:
        a = []
        for p in all_projects:
            a.append({
                "name": p.name,
                "description": p.description,
                "video": p.video.url,
                "thumbnail": p.thumbnail.url,
                "index": p.id
            })
        
        c["projects"] = a
        del a

    template = loader.get_template("projects.html")
    return HttpResponse(template.render(c, request))