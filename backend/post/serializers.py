from rest_framework import serializers
from .models import Post, Image, Skill, Sample, FooterItem

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'name', 'is_section', 'container_id', 'container_class', 'wordiness', 'order_key']
        for base in ['title', 'subtitle', 'content']:
            fields.append(base)
            for addition in ['class', 'id']:
                fields.append('%s_%s' % (base, addition))


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name', 'image']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            'id',
            'name',
            'wordiness',
            'order_key',
            'description',
            'image',
            'price',
            'price_unit',
            'recurring_price',
            'recurring_price_unit',
            'revision_price',
            'revision_price_unit',
            'is_consultation'
        ]

class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = ['id', 'name', 'href', 'wordiness', 'order_key', 'description', 'image']

class FooterItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterItem
        fields = ['id', 'name', 'href', 'order_key', 'image']
