from django.shortcuts import redirect

def index(request):
  response = redirect('https://mattfinger.info')
  return response
