from django.contrib import admin
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("", include("Home.urls")),
    path("projects/", include("Projects.urls")),
    path("account/", include("Account.urls")),
    path("admin/", admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


handler400 = "Home.views.error_400"
handler403 = "Home.views.error_403"
handler404 = "Home.views.error_404"
handler500 = "Home.views.error_500"