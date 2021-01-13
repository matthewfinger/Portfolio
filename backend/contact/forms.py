from django import forms
from django.utils.translation import gettext_lazy as _

from .models import Contact, Message

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = [
            'first_name',
            'last_name',
            'company',
            'phone',
            'email',
            'website',
            'other_info',
        ]

        labels = {
            'other_info': _('How can I best contact you?')
        }

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = [
            'text'
        ]

        labels = {
            'text': _('Message')
        }
