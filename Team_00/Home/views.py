from django.shortcuts import render

from django.http import HttpResponse

from django.template import loader

from Projects.models import Project, DocumentVideos

from django.views.decorators.http import require_GET


@require_GET
def index(request):
    p = Project.objects.last()
    d = DocumentVideos.objects.filter(project=p).last()
    c = {}
    if d:
        c = {
            "last_project": {
                "name": p.name,
                "description": p.description,
                "video": d.video.url,
                "thumbnail": d.thumbnail.url
            }
        }
    template = loader.get_template("index.html")
    return HttpResponse(template.render(c, request))


def error_handler(request, code, title, description):
    template = loader.get_template("error.html")
    c = {"error": {
            "code": code,
            "title": title,
            "description": description,
        }}
    return HttpResponse(template.render(c, request), status=404)


def error_400(request, exception=None):
    return error_handler(request, code=400, title="Bad Request", description=f"Request was not polite enough")


def error_403(request, exception=None):
    return error_handler(request, code=403, title="Permission Denied", description=f"Your client does not have permission to get URL \"{request.path}\" from this server. That’s all we know.")


def error_404(request, exception=None):
    return error_handler(request, code=404, title="Not Found", description=f"The requested URL \"{request.path}\" was not found on this server. That’s all we know.")


def error_500(request, exception=None):
    return error_handler(request, code=500, title="Server Error", description=f"Internal Server Error")