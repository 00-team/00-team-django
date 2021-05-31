from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import loader
from django.views.decorators.http import require_GET, require_POST

from .models import Project, Star, DocumentImages, DocumentVideos
from Account.models import UserAccount, User
from Account.views import BodyLoader

no_thumbnail = "data:image/png;base64,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"


def most_stars(all_projects):
    proj = {}
    for p in all_projects:
        proj[str(p.id)] = len(Star.objects.filter(project=p))

    proj = {k: v for k, v in sorted(proj.items(), key = lambda item: item[1])[:-7:-1]}
    s = []
    for pi, st in proj.items():
        p = Project.objects.get(id=int(pi))
        dv = DocumentVideos.objects.filter(project=p)
        di = DocumentImages.objects.filter(project=p)

        thumbnail = no_thumbnail

        if dv:
            thumbnail = dv.last().thumbnail.url

        s.append({
            "name": p.name,
            "description": p.description,
            "thumbnail": thumbnail,
            "slug": p.slug,
            "date_start": p.date_start.strftime("%Y-%m-%d"),
            "stars": st,
            "language": p.language,
            "workspace": p.workspace
        })
    
    return s


@require_GET
def projects_view(request):
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
def project_view(request, slug):
    if not Project.objects.filter(slug=slug).exists():
        return JsonResponse({'error':'project not found'})

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

    
    c["p"]["link"] = p.git
    c["p"]["link_name"] = "Git"

    template = loader.get_template("project.html")
    return HttpResponse(template.render(c, request))


@require_POST
def modify_star(r):
    # token = r.POST.get('token')
    data = BodyLoader(r.body)

    if r.user.is_authenticated:
        user = r.user
    else:
        return JsonResponse({'Error': 'first login'})
    

    # project id
    project_id = data.get('project_id')


    if Project.objects.filter(id=project_id).exists():
        project = Project.objects.get(id=project_id)
    else:
        return JsonResponse({'Error':f'Project with project id: {project_id} was not found.'}, status=404)
    
    

    if Star.objects.filter(user=user, project=project).exists():
        Star.objects.get(user=user, project=project).delete()
        return JsonResponse({"success":"Your Star Removed"})
    else:
        Star.objects.create(user=user, project=project)
        return JsonResponse({"success":"Your Star added"})






@receiver(pre_delete, sender=DocumentImages)
def delete_images(sender, instance, **kwargs):
    print(instance.id)
    instance.image.storage.delete(instance.image.name)


@receiver(pre_delete, sender=DocumentVideos)
def delete_videos(sender, instance, **kwargs):
    print(instance.id)
    instance.video.storage.delete(instance.video.name)
    instance.thumbnail.storage.delete(instance.thumbnail.name)