from django.shortcuts import render
from django.http import HttpResponse
from .models import Post
from .serializers import PostSerializer
from rest_framework import viewsets

class PostViewSet(viewsets.ModelViewSet):
    # API endpoint that allows Posts to be viewed or edited
    queryset = Post.objects.all()
    serializer_class = PostSerializer
