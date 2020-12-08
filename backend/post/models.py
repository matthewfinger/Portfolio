from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100)
    title_class = models.CharField(max_length=100, default='post_title')
    content = models.TextField(max_length=5000)
    content_class = models.CharField(max_length=100, default='post_content')
