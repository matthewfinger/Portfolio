from django.contrib import admin
from . import models

class PostAdmin(admin.ModelAdmin):
    list_display = ('name','title','order_key','wordiness','id',)

class ImageAdmin(admin.ModelAdmin):
    list_display = ('name','image','id',)

class SkillAdmin(admin.ModelAdmin):
    list_display = ('name','order_key','wordiness','id',)

admin.site.register(models.Post, PostAdmin)
admin.site.register(models.Image, ImageAdmin)
admin.site.register(models.Skill, SkillAdmin)
