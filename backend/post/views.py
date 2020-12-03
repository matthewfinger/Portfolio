from django.shortcuts import render
from django.http import HttpResponse

from . import models

def index(request):
    posts = models.Post.objects.all()
    res = '<div>'
    for post in posts:
        res += "<p>"
        res += post.id
        res += "</p>"
        res += "<p>"
        res += post.title
        res += " </p>"

    if len(posts) == 0:
        res += "<h1>No Posts Added!</h1>"
    res += '</div>'
    return HttpResponse(res)
