import json

from .models import Project, Star, DocumentImages, DocumentVideos


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

def TOTAL_STARS(p):
    return len(Star.objects.filter(project=p))


def USER_STARED(u, p):
    return Star.objects.filter(user=u, project=p).exists()


def PROJECT_HAS_VIDEO(p):
    dv = DocumentVideos.objects.filter(project=p).last()

    if dv:
        return dv.video.url
    
    return None