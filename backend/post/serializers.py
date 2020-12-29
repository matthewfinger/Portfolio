from rest_framework import serializers
from .models import Post, Image

class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'name', 'is_section', 'container_id', 'container_class', 'order_key']
        for base in ['title', 'subtitle', 'content']:
            fields.append(base)
            for addition in ['class', 'id']:
                fields.append('%s_%s' % (base, addition))


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name','image']
