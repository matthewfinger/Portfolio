from django.urls import path, include
from . import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('', views.post_list),
    path('sections/', views.post_list, {'sections':True}),
    path('name/<str:name>', views.post_detail),
    path('<int:pk>', views.post_detail),
    path('image/', views.image_list),
    path('image/name/<str:name>', views.image_detail),
    path('image/<int:pk>', views.image_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
