from django.contrib import admin
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings

from django.views.generic import TemplateView


urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('projects/', include('Projects.urls')),
    path('account/', include('Account.urls')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
