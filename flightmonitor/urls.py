from django.urls import path 
from . import views

urlpatterns = [
    path('', views.default_layout, name='default_layout'),
    path('signup/', views.signup, name='signup'),
]