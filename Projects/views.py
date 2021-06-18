import json

from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import loader
from django.views.decorators.http import require_GET, require_POST

from .models import Project, Star, DocumentImages, DocumentVideos
from Account.models import UserAccount, User
from Account.decorators import login_required


def GetThumbnail(project: Project) -> str:
    pdv = DocumentVideos.objects.filter(project=project).last()
    pdi = DocumentImages.objects.filter(project=project).last()

    if pdv:
        return pdv.thumbnail.url
    elif pdi:
        return pdi.image.url
    else:
        return None


def BodyLoader(body):
    try:
        return json.loads(body)
    except Exception:
        return {}

TS = lambda p: len(Star.objects.filter(project=p))

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

        thumbnail = 'x'

        if dv:
            thumbnail = dv.last().thumbnail.url

        s.append({
            'name': p.name,
            'description': p.description,
            'thumbnail': thumbnail,
            'slug': p.slug,
            'date_start': p.date_start.strftime('%Y-%m-%d'),
            'stars': st,
            'language': p.language,
            'workspace': p.workspace
        })
    
    return s


@require_GET
def get_projects(r):
    ps = list(map(lambda p: {
        'name': p.name,
        'description': p.description,
        'thumbnail': GetThumbnail(p),
        'slug': p.slug,
        'date_start': p.date_start.strftime('%Y-%m-%d'),
        'rawtime': int(p.date_start.timestamp()),
        'stars': TS(p),
        'language': p.language,
        'workspace': p.workspace,
    }, Project.objects.all()))

    return JsonResponse({'projects': ps})


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
            return HttpResponseRedirect(f'/account/?next={request.path}')

        if Star.objects.filter(user=request.user, project=p).exists():
            user_stared = True
                

    stars = len(Star.objects.filter(project=p))

    c = {
        'p': {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'slug': p.slug,
            'date_start': p.date_start.strftime('%Y-%m-%d'),
            'stars': stars,
            'language': p.language,
            'workspace': p.workspace,
            'stared': user_stared
        },
        'useracc_token': user_token
    }

    d = DocumentVideos.objects.filter(project=p).last()

    if d:
        c['p']['video'] = d.video.url
        c['p']['thumbnail'] = d.thumbnail.url

    
    c['p']['link'] = p.git
    c['p']['link_name'] = 'Git'

    template = loader.get_template('project.html')
    return HttpResponse(template.render(c, request))


@require_POST
@login_required
def modify_star(r):
    user = r.user
    data = {}

    if r.POST:
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)

    project_id = data.get('project_id')

    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return JsonResponse({'error':f'Project with project id: {project_id} does not exist.'}, status=404)


    try:
        Star.objects.get(user=user, project=project).delete()
        return JsonResponse({'action':'remove', 'project_id': project.id})

    except Star.DoesNotExist:
        s = Star(user=user, project=project)
        s.save()

        p = {
            'id': project.id,
            'name': project.name,
            'slug': project.slug,
            'thumbnail': None,
            'lang': project.language,
            'wspace': project.workspace,
        }
        pdv = DocumentVideos.objects.filter(project=project).last()
        pdi = DocumentImages.objects.filter(project=project).last()

        if pdv:
            p['thumbnail'] = pdv.thumbnail.url
        elif pdi:
            p['thumbnail'] = pdi.image.url

        return JsonResponse({'action':'add', 'project': p})


@receiver(pre_delete, sender=DocumentImages)
def delete_images(sender, instance, **kwargs):
    instance.image.storage.delete(instance.image.name)


@receiver(pre_delete, sender=DocumentVideos)
def delete_videos(sender, instance, **kwargs):
    instance.video.storage.delete(instance.video.name)
    instance.thumbnail.storage.delete(instance.thumbnail.name)