from django.urls import path 
from . import views

urlpatterns = [
    path('', views.default_layout, name='default_layout'),
    path('register/', views.register, name='register'),
    path('m_logout/', views.m_logout, name='m_logout'),
]