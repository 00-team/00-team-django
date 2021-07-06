import json

from .models import Project, Star, DocumentImages, DocumentVideos
from Account.models import UserAccount, User, UserTemp

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

def NextPath(r):
    data = {}

    if r.method == 'GET':
        data = r.GET
    elif r.method == 'POST':
        data = r.POST
    elif r.body:
        data = BodyLoader(r.body)
    
    if data.get('next'):
        return data.get('next')
    elif r.session.get('next'):
        return r.session.get('next')
    
    return '/'

def RequestData(response):
    try:
        return response.json()
    except Exception:
        return {
            'error': 'can`t get data'
        }

def GetOrMakeUA(user: User) -> UserAccount:
    try:
        return UserAccount.objects.get(user=user)
    except UserAccount.DoesNotExist:
        ua = UserAccount(user=user)
        ua.save()
        return ua

def CheckTmeps():
    for ut in UserTemp.objects.all():
        ut.check_time
