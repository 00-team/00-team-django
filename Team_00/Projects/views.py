from django.shortcuts import render

from django.http import HttpResponse

from django.template import loader

from Projects.models import Project

from django.views.decorators.http import require_GET

from Home.views import error_404

@require_GET
def projects(request):
    star_projects = Project.objects.order_by("-stars")[:6]
    time_projects = Project.objects.order_by("-date_start")[:6]
    c = {}
    if star_projects:
        s = []
        for p in star_projects:
            s.append({
                "name": p.name,
                "description": p.description,
                "video": p.video.url,
                "thumbnail": p.thumbnail.url,
                "slug": p.slug,
                "date_start": p.date_start.strftime("%Y-%m-%d"),
                "stars": p.stars,
                "language": p.language,
                "workspace": p.workspace
            })
    
    if time_projects:
        t = []
        for p in time_projects:
            t.append({
                "name": p.name,
                "description": p.description,
                "video": p.video.url,
                "thumbnail": p.thumbnail.url,
                "slug": p.slug,
                "date_start": p.date_start.strftime("%Y-%m-%d"),
                "stars": p.stars,
                "language": p.language,
                "workspace": p.workspace
            })
        
        c["star_projects"] = s
        c["time_projects"] = t

    template = loader.get_template("projects.html")
    return HttpResponse(template.render(c, request))


@require_GET
def project(request, slug):
    if Project.objects.filter(slug=slug).exists():
        p = Project.objects.get(slug=slug)
    else:
        return error_404(request, exception="X")

    return HttpResponse(p)
