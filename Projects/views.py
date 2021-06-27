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
SS = lambda u, p: Star.objects.filter(user=u, project=p).exists()


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
        'self_star': SS(r.user, p),
        'language': p.language,
        'workspace': p.workspace,
    }, Project.objects.all()))

    return JsonResponse({'projects': ps})


@require_GET
def get_project(r, slug):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return JsonResponse({'error':'project not found'}, status=404)
    
    p = {
        'id': project.id,
        'name': project.name,
        'description': project.description,
        'date_start': project.date_start.strftime('%Y-%m-%d'),
        'stars': TS(project),
        'language': project.language,
        'workspace': project.workspace,
        'status': project.status_lable,
        'git': project.git,
        'self_star': SS(r.user, project),
        'docs': list(
            map(lambda dv: {
                'type': 'video',
                'video': dv.video.url,
                'thumbnail': dv.thumbnail.url
            }, DocumentVideos.objects.filter(project=project))
        ) + list(
            map(lambda di: {
                'type':'image',
                'image': di.image.url
            }, DocumentImages.objects.filter(project=project))
        )
    }


    return JsonResponse({'project': p})


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


@require_POST
def get_stars(r):
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

    
    ds = {
        'count': TS(project),
        'self_star': SS(r.user, project),
    }
    
    return JsonResponse({'data': ds})


@receiver(pre_delete, sender=DocumentImages)
def delete_images(sender, instance, **kwargs):
    instance.image.storage.delete(instance.image.name)


@receiver(pre_delete, sender=DocumentVideos)
def delete_videos(sender, instance, **kwargs):
    instance.video.storage.delete(instance.video.name)
    instance.thumbnail.storage.delete(instance.thumbnail.name)
