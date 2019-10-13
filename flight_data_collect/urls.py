from django.urls import path 
from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^connect/(?P<connect_address>[^/]+)/$', views.connect_vehicle, name='connect-vehicle'),
    url('disconnect/', views.disconnect_vehicle, name='disconnect-vehicle'),
]