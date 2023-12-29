# change from old Django to new Django
# https://stackoverflow.com/questions/70319606/importerror-cannot-import-name-url-from-django-conf-urls-after-upgrading-to

from django.urls import include, re_path
from django.urls import path
from . import views

urlpatterns = [
    path(r'^connect/(?P<connect_address>[^/]+)/$', views.connect_vehicle, name='connect-vehicle'),
    path(r'disconnect/(?P<connect_address>[^/]+)/$', views.disconnect_vehicle, name='disconnect-vehicle'),
    path(r'control/setmode/(?P<droneid>[^/]+)/(?P<mode>[^/]+)/$', views.set_mode, name='set-mode'),
    path(r'control/setwaypoint/(?P<droneid>[^/]+)/(?P<lat>[^/]+)/(?P<lon>[^/]+)/(?P<alt>[^/]+)/$', views.set_waypoint,
        name='set-waypoint'),
    path(r'control/arm/(?P<droneid>[^/]+)/$', views.arm, name='arm'),
    path(r'control/disarm/(?P<droneid>[^/]+)/$', views.disarm, name='arm'),
    path(r'control/flyto/(?P<droneid>[^/]+)/(?P<lat>[^/]+)/(?P<lon>[^/]+)/(?P<alt>[^/]+)/$', views.fly_to,
        name='fly-to'),
    path(r'update-fields/$', views.update_fields, name='update-fields'),
    path(r'get-available-fields/$', views.get_available_fields, name='get-available-fields')
]
