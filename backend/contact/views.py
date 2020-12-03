from django.shortcuts import render
from django.http import HttpResponse

from . import models

def index(request):
    contacts = models.Contact.objects.all()
    res = '<div>'
    for contact in contacts:
        res += "<p>"
        res += contact.id
        res += "</p>"
        res += "<p>"
        res += contact.title
        res += " </p>"

    if len(contacts) == 0:
        res += "<h1>No Contacts Added!</h1>"
    res += '</div>'
    return HttpResponse(res)
