from django.contrib import admin
from . import models

class PostAdmin(admin.ModelAdmin):
    list_display = ('name','title','order_key','wordiness','id',)

class ImageAdmin(admin.ModelAdmin):
    list_display = ('name','image','id',)

class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name','resource','id',)

class SkillAdmin(admin.ModelAdmin):
    list_display = ('name','order_key','wordiness','id','enabled',)

class SampleAdmin(admin.ModelAdmin):
    list_display = ('name','href','order_key','wordiness','id',)

class FooterItemAdmin(admin.ModelAdmin):
    list_display = ('name','href','order_key','id',)

class VisitAdmin(admin.ModelAdmin):
    list_display = ('date','ip')

admin.site.register(models.Post, PostAdmin)
admin.site.register(models.Image, ImageAdmin)
admin.site.register(models.Resource, ResourceAdmin)
admin.site.register(models.Skill, SkillAdmin)
admin.site.register(models.Sample, SampleAdmin)
admin.site.register(models.FooterItem, FooterItemAdmin)
admin.site.register(models.Visit, VisitAdmin)
