from django.db import models
from uuid import uuid4

class Post(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_section = models.BooleanField(blank=True, default=False)
    container_id = models.CharField(max_length=100, default='', blank=True)
    container_class = models.CharField(max_length=100, default='', blank=True)
    wordiness = models.IntegerField(default=0, blank=True) # used to specify how verbose the post is
    order_key = models.IntegerField(default=0, blank=True)
    title = models.CharField(max_length=100, blank=True, default='')
    title_id = models.CharField(max_length=100, default='', blank=True)
    title_class = models.CharField(max_length=100, default='post_title')
    subtitle = models.CharField(max_length=100, default='', blank=True)
    subtitle_id = models.CharField(max_length=100, default='', blank=True)
    subtitle_class = models.CharField(max_length=100, default='post_subtitle')
    content = models.TextField(max_length=5000, blank=True, default='')
    content_class = models.CharField(max_length=100, default='post_content')
    content_id = models.CharField(max_length=100, default='', blank=True)

class Image(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="images/")

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    wordiness = models.IntegerField(default=0, blank=True)
    order_key = models.IntegerField(default=0, blank=True)
    description = models.TextField(max_length=1000, blank=True, default='')
    image = models.ForeignKey('Image', models.SET_NULL, blank=True, null=True)
