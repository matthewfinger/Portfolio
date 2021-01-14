from django.shortcuts import render
from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from . import models
from . import forms

def index(request):
    contacts = models.Contact.objects.all()
    res = '<div>'
    for contact in contacts:
        res += "<p>"
        res += contact.id
        res += "</p>"
        res += "<p>"
        res += contact.title
        res += " </p>"

    if len(contacts) == 0:
        res += "<h1>No Contacts Added!</h1>"
    res += '</div>'
    return HttpResponse(res)

def ContactForm(request):
    contact_form = forms.ContactForm(request.POST or None)
    message_form = forms.MessageForm(request.POST or None)
    if message_form.is_valid() and contact_form.is_valid():
        #save to the database
        contact_obj = contact_form.save(commit=True)
        message_obj = message_form.save(commit=False)
        message_obj.contact_entry = contact_obj
        contact_obj.save()
        message_obj.save()

        #setup the email
        contact_info = []
        contact_model = model_to_dict(contact_obj)
        for key in contact_model.keys():
            if contact_model[key]:
                contact_info.append({'k': key, 'v': contact_model[key]})

        email_context = {
            'message': message_obj,
            'contact_pairs': contact_info,
            'name': 'someone',
        }

        subject = "Form submission from your website"
        name = ''

        if contact_obj.first_name:
            name += contact_obj.first_name
        if contact_obj.last_name:
            name += ' ' + contact_obj.last_name

        if name:
            subject = '{} | {}'.format(name, subject)
            email_context['name'] = name

        html_message = render_to_string('FormSubmissionEmail.html', email_context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject,
            message=plain_message,
            from_email=contact_obj.email,
            recipient_list=['matthewfinger3@gmail.com'],
            html_message=html_message,
        )



    context = {
        'contact_form': contact_form,
        'message_form': message_form,
    }

    response = render(request, 'contact_form.html', context)
    response["Content-Security-Policy"] = "default-src * 'unsafe-inline'; frame-ancestors *"
    response["Access-Control-Allow-Origin"] = '*'
    return response
