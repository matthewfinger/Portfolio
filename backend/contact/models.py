from django.db import models

class Contact(models.Model):
    first_name = models.CharField(max_length=100, default='')
    last_name = models.CharField(max_length=100, default='')
    phone = models.CharField(max_length=10)
    email = models.EmailField()
    other_info = models.CharField(max_length=1000)
