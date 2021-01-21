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
    path('skills/', views.skill_list),
    path('skills/<int:pk>', views.skill_detail),
    path('samples/', views.sample_list),
    path('samples/<int:pk>', views.sample_detail),
    path('footer_items/', views.footer_item_list),
    path('footer_items/<int:pk>', views.footer_item_detail),
    path('visit/', views.visit),
    path('new_visit/', views.new_visit),
]

urlpatterns = format_suffix_patterns(urlpatterns)
