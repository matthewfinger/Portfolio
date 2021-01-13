from django.db import models

class Contact(models.Model):
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    other_info = models.CharField(max_length=1000, blank=True)

class Message(models.Model):
    text = models.TextField(max_length=5000)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    contact_entry = models.ForeignKey(Contact, on_delete=models.SET_NULL, blank=True, null=True)
