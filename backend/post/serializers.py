from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'name']
        for base in ['title', 'subtitle', 'content']:
            fields.append(base)
            for addition in ['class', 'id']:
                fields.append('%s_%s' % (base, addition))
