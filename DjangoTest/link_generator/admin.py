from django.contrib import admin

# Register your models here.

from .models import Project, LinkPack, LinkSet

admin.site.register([Project, LinkPack, LinkSet])
