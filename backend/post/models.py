from django.db import models
from uuid import uuid4

class NoStripCharField(models.CharField):
  def formfield(self, **kwargs):
    original_args = kwargs.copy()
    kwargs = {
        "max_length":  100,
        "blank": True,
        "default": "per hour"
    }.update(kwargs)
    try:
      kwargs['strip'] = False
      return super(type(self),self).formfield(**kwargs)
    except:
      return super(type(self),self).formfield(**original_args)


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
    enabled = models.BooleanField(blank=True, default=True)

class Image(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="images/")

    def __str__(self):
        return '{}'.format(self.name)

class Resource(models.Model):
    name = models.CharField(max_length=100, unique=True)
    resource = models.FileField(upload_to="uploads/")

    def __str__(self):
        return self.name

class PriceField(models.DecimalField):
    def __init__(self, **kwargs):
        kwargs['max_digits'] = 10
        kwargs['decimal_places'] = 2
        kwargs['blank'] = True
        kwargs['null'] = True
        kwargs['default'] = None
        super().__init__(**kwargs)

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    wordiness = models.IntegerField(default=0, blank=True)
    order_key = models.IntegerField(default=0, blank=True)
    description = models.TextField(max_length=1000, blank=True, default='')
    image = models.ForeignKey('Image', models.SET_NULL, blank=True, null=True)
    enabled = models.BooleanField(blank=True, default=True)
    price = PriceField()
    price_unit = NoStripCharField(default="per hour")
    recurring_price = PriceField()
    recurring_price_unit = NoStripCharField(default="per month")
    revision_price = PriceField()
    revision_price_unit = NoStripCharField(default="per revision")


class Sample(models.Model):
    name = models.CharField(max_length=100, unique=True)
    wordiness = models.IntegerField(default=0, blank=True)
    href = models.URLField(blank=True)
    order_key = models.IntegerField(default=0, blank=True)
    description = models.TextField(max_length=1000, blank=True, default='')
    image = models.ForeignKey('Image', models.SET_NULL, blank=True, null=True)

class FooterItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    href = models.CharField(max_length=1000)
    order_key = models.IntegerField(default=0, blank=True)
    image = models.ForeignKey('Image', models.SET_NULL, blank=True, null=True)

#to record each visitor of the website
class Visit(models.Model):
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    ip = models.CharField(max_length=39)
