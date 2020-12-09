from django.urls import path, include
from . import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('', views.post_list),
    path('name/<str:name>', views.post_detail),
    path('<int:pk>', views.post_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
