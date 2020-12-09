from django.db import models
from uuid import uuid4

class Post(models.Model):
    name = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100, blank=True, default='')
    title_id = models.CharField(max_length=100, default='', blank=True)
    title_class = models.CharField(max_length=100, default='post_title')
    subtitle = models.CharField(max_length=100, default='', blank=True)
    subtitle_id = models.CharField(max_length=100, default='', blank=True)
    subtitle_class = models.CharField(max_length=100, default='post_subtitle')
    content = models.TextField(max_length=5000, blank=True, default='')
    content_class = models.CharField(max_length=100, default='post_content')
    content_id = models.CharField(max_length=100, default='', blank=True)
