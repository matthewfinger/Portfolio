from django.urls import path, include
from . import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('', views.post_list),
    path('<int:pk>', views.post_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
