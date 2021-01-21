from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

#get ALL images or POST a new image
@api_view(['GET','POST'])
def image_list(request, format=None):
    if request.method == 'GET':
        images = Image.objects.all()
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def image_detail(request, pk=None, name=None, format=None):
    args = {}
    if pk:
        args['pk'] = pk
    elif name:
        args['name'] = name
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        image = Image.objects.get(**args)
    except Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ImageSerializer(image)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ImageSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


#get ALL posts & POST a new post
@api_view(['GET','POST'])
def post_list(request, sections=False, format=None):
    if request.method == 'GET':
        posts = Post.objects.all()
        if sections:
            posts = posts.filter(is_section=True)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)

#get/read, put/update, or delete a post
@api_view(['GET', 'PUT','DELETE'])
def post_detail(request, pk=None, name=None, format=None):
    args = {}
    if pk:
        args['pk'] = pk
    else:
        args['name'] = name
    try:
        post = Post.objects.get(**args)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)



#get ALL skills & POST a new skill
@api_view(['GET','POST'])
def skill_list(request, format=None):
    if request.method == 'GET':
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def skill_detail(request, pk=None, name=None, format=None):
    args = {}
    if pk:
        args['pk'] = pk
    elif name:
        args['name'] = name
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        skill = Skill.objects.get(**args)
    except Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SkillSerializer(skill)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SkillSerializer(skill, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


#get ALL samples & POST a new sample
@api_view(['GET','POST'])
def sample_list(request, format=None):
    if request.method == 'GET':
        samples = Sample.objects.all()
        serializer = SampleSerializer(samples, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = SampleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def sample_detail(request, pk=None, name=None, format=None):
    args = {}
    if pk:
        args['pk'] = pk
    elif name:
        args['name'] = name
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        sample = Sample.objects.get(**args)
    except Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SampleSerializer(sample)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SampleSerializer(sample, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        sample.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


#footer item endpoints
@api_view(['GET','POST'])
def footer_item_list(request, format=None):
    if request.method == 'GET':
        footer_items = FooterItem.objects.all()
        serializer = FooterItemSerializer(footer_items, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = FooterItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def footer_item_detail(request, pk=None, name=None, format=None):
    args = {}
    if pk:
        args['pk'] = pk
    elif name:
        args['name'] = name
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        footer_item = FooterItem.objects.get(**args)
    except Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = FooterItemSerializer(footer_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = FooterItemSerializer(footer_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        footer_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)

def visit(request, new=False):
    print('hello world')
    res = HttpResponse()
    try:
        if not new:
            visits = Visit.objects.all()
            visit_dicts = []
            for visit in visits:
                visit_dicts.append(model_to_dict(visit))
            return JsonResponse({'content': visit_dicts})
        else:
            ip=''
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            _visit = Visit(ip=ip)
            _visit.save()
            return JsonResponse(model_to_dict(_visit))
    except err:
        res.status_code = 400
        res.reason_phrase = "Should only be sending get and post requests"
        return res

def new_visit(request):
    return visit(request, True)
