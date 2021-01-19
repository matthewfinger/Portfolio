from django.contrib import admin
from . import models

class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name','phone','email','id',)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('date','text','contact_entry',)


admin.site.register(models.Contact, ContactAdmin)
admin.site.register(models.Message, MessageAdmin)
