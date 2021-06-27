from django.contrib import admin

from .models import Project, Star, DocumentVideos, DocumentImages


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'language', 'workspace')
        }),
        ('Advanced options', {
            'classes': ('collapse',),
            'fields': ('date_start', 'status', 'slug', 'git'),
        }),
    )

    list_filter = ('status', 'language', 'workspace')
    list_per_page = 15


@admin.register(DocumentVideos, DocumentImages)
class DocumentAdmin(admin.ModelAdmin):
    list_per_page = 15
    list_display = ('__str__', 'status')
    list_filter = ('project',)

    @admin.display
    def status(self, o):
        s = o.project.status or 'No Status'
        return ('Public' if o.project.status == 'PB' else 'Private')


@admin.register(Star)
class StarAdmin(admin.ModelAdmin):
    list_per_page = 15
    list_display = ('user', 'project')
    list_filter = ('user', 'project')
