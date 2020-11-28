from django.urls import path 
from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^connect/(?P<connect_address>[^/]+)/$', views.connect_vehicle, name='connect-vehicle'),
    url(r'disconnect/(?P<connect_address>[^/]+)/$', views.disconnect_vehicle, name='disconnect-vehicle'),
    url(r'control/setmode/(?P<droneid>[^/]+)/(?P<mode>[^/]+)/$', views.set_mode, name='set-mode'),
    url(r'control/setwaypoint/(?P<droneid>[^/]+)/(?P<lat>[^/]+)/(?P<lon>[^/]+)/(?P<alt>[^/]+)/$', views.set_waypoint, name='set-waypoint'),
    url(r'control/arm/(?P<droneid>[^/]+)/$', views.arm, name='arm'),
    url(r'control/disarm/(?P<droneid>[^/]+)/$', views.disarm, name='arm'),
    url(r'control/flyto/(?P<droneid>[^/]+)/(?P<lat>[^/]+)/(?P<lon>[^/]+)/(?P<alt>[^/]+)/$', views.fly_to, name='fly-to'),
    url(r'update-fields/$', views.update_fields, name='update-fields')
]