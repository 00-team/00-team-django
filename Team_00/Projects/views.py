from django.shortcuts import render

from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseRedirect

from django.template import loader

from .models import Project, Star, DocumentImages, DocumentVideos
from Account.models import UserAccount, User

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
        d = DocumentVideos.objects.filter(project=p).last()
        if d:
            s.append({
                "name": p.name,
                "description": p.description,
                "thumbnail": d.thumbnail.url,
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
        d = DocumentVideos.objects.filter(project=p).last()
        if d:
            t.append({
                "name": p.name,
                "description": p.description,
                "thumbnail": d.thumbnail.url,
                "slug": p.slug,
                "date_start": p.date_start.strftime("%Y-%m-%d"),
                "stars": stars,
                "language": p.language,
                "workspace": p.workspace
            })
    
    for p in all_projects:
        stars = len(Star.objects.filter(project=p))
        d = DocumentVideos.objects.filter(project=p).last()
        if not d:
            continue

        a.append({
            "name": p.name,
            "description": p.description,
            "thumbnail": d.thumbnail.url,
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

    user_token = None
    user_stared = False
    p = Project.objects.get(slug=slug)

    if request.user.is_authenticated:
        if UserAccount.objects.filter(user=request.user).exists():
            user_acc = UserAccount.objects.get(user=request.user)
            if user_acc.token:
                user_token = user_acc.token
        
        if not user_token:
            return HttpResponseRedirect(f"/account/?next={request.path}")

        if Star.objects.filter(user=request.user, project=p).exists():
            user_stared = True
                

    stars = len(Star.objects.filter(project=p))

    c = {
        "p": {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "slug": p.slug,
            "date_start": p.date_start.strftime("%Y-%m-%d"),
            "stars": stars,
            "language": p.language,
            "workspace": p.workspace,
            "stared": user_stared
        },
        "useracc_token": user_token
    }

    d = DocumentVideos.objects.filter(project=p).last()

    if d:
        c["p"]["video"] = d.video.url
        c["p"]["thumbnail"] = d.thumbnail.url

    if p.private == "PR":
        c["p"]["link"] = p.shop
        c["p"]["link_name"] = "Shop"
    else:
        c["p"]["link"] = p.git
        c["p"]["link_name"] = "Git"

    template = loader.get_template("project.html")
    return HttpResponse(template.render(c, request))


@require_POST
def modify_star(request):
    data = request.POST
    if not data.get("token") or not data.get("pid"):
        return JsonResponse({
            "error":"data is not Valid"
        })
    
    pid = data.get("pid")

    if pid.isnumeric():
        pid = int(pid)
    
    if not Project.objects.filter(id=pid).exists():
        return JsonResponse({
            "error":"Project Not Found"
        })
    
    p = Project.objects.get(id=pid)

    if not UserAccount.objects.filter(token=data.get("token")).exists():
        return JsonResponse({
            "error":"User Not Found"
        })
    
    u = UserAccount.objects.get(token=data.get("token")).user

    if Star.objects.filter(user=u, project=p).exists():
        s = Star.objects.get(user=u,project=p)
        s.delete()
        return JsonResponse({
            "success":"Your Star Removed"
        })
    
    s = Star.objects.create(user=u,project=p)
    s.save()

    return JsonResponse({
        "success":"Your Star added"
    })