from django.shortcuts import render

from django.http import HttpResponse

from django.template import loader

from Projects.models import Project, Star

from django.views.decorators.http import require_GET, require_POST

from Home.views import error_404


def most_stars(all_projects):
    proj = {}
    for p in all_projects:
        proj[str(p.id)] = len(Star.objects.filter(project=p))

    proj = {k: v for k, v in sorted(proj.items(), key = lambda item: item[1])[:-7:-1]}
    s = []
    for pi, st in proj.items():
        p = Project.objects.get(id=int(pi))
        s.append({
            "name": p.name,
            "description": p.description,
            "video": p.video.url,
            "thumbnail": p.thumbnail.url,
            "slug": p.slug,
            "date_start": p.date_start.strftime("%Y-%m-%d"),
            "stars": st,
            "language": p.language,
            "workspace": p.workspace
        })
    
    return s


@require_GET
def projects(request):
    all_projects = Project.objects.all()
    star_projects = most_stars(all_projects)
    time_projects = Project.objects.order_by("-date_start")[:6]
    
    c = {}
    a, t = [] , []
    
    for p in time_projects:
        stars = len(Star.objects.filter(project=p))
        t.append({
            "name": p.name,
            "description": p.description,
            "video": p.video.url,
            "thumbnail": p.thumbnail.url,
            "slug": p.slug,
            "date_start": p.date_start.strftime("%Y-%m-%d"),
            "stars": stars,
            "language": p.language,
            "workspace": p.workspace
        })
    
    for p in all_projects:
        stars = len(Star.objects.filter(project=p))
        a.append({
            "name": p.name,
            "description": p.description,
            "video": p.video.url,
            "thumbnail": p.thumbnail.url,
            "slug": p.slug,
            "date_start": p.date_start.strftime("%Y-%m-%d"),
            "stars": stars,
            "language": p.language,
            "workspace": p.workspace
        })
    
    if all_projects:
        c["star_projects"] = star_projects
        c["time_projects"] = t
        c["all_projects"] = a

    template = loader.get_template("projects.html")
    return HttpResponse(template.render(c, request))


@require_GET
def project(request, slug):
    if not Project.objects.filter(slug=slug).exists():
        return error_404(request)
        
    p = Project.objects.get(slug=slug)
    stars = len(Star.objects.filter(project=p))
    c = {
        "p": {
            "name": p.name,
            "description": p.description,
            "video": p.video.url,
            "thumbnail": p.thumbnail.url,
            "slug": p.slug,
            "date_start": p.date_start.strftime("%Y-%m-%d"),
            "stars": stars,
            "language": p.language,
            "workspace": p.workspace
        }
    }

    if p.private == "PR":
        c["p"]["link"] = p.shop
        c["p"]["link_name"] = "Shop"
    else:
        c["p"]["link"] = p.git
        c["p"]["link_name"] = "Git"

    template = loader.get_template("project.html")
    return HttpResponse(template.render(c, request))
