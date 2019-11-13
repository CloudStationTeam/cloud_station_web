from django.urls import path 
from . import views

urlpatterns = [
    path('', views.default_layout, name='default_layout'),
    path('logged_in/', views.logged_in, name='logged_in'),
    path('map/', views.map, name='map'),
]