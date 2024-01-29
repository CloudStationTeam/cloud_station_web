# change from old Django to new Django
# https://stackoverflow.com/questions/70319606/importerror-cannot-import-name-url-from-django-conf-urls-after-upgrading-to

from django.urls import include, re_path
from django.urls import path
from . import views

urlpatterns = [
    re_path(r'^connect/(?P<connect_address>[^/]+)/$', views.connect_vehicle, name='connect-vehicle'),
    re_path(r'disconnect/(?P<connect_address>[^/]+)/$', views.disconnect_vehicle, name='disconnect-vehicle'),
    re_path(r'control/setmode/(?P<droneid>[^/]+)/(?P<mode>[^/]+)/$', views.set_mode, name='set-mode'),
    re_path(r'control/setwaypoint/(?P<droneid>[^/]+)/(?P<lat>[^/]+)/(?P<lon>[^/]+)/(?P<alt>[^/]+)/$', views.set_waypoint,
        name='set-waypoint'),
    re_path(r'control/arm/(?P<droneid>[^/]+)/$', views.arm, name='arm'),
    re_path(r'control/disarm/(?P<droneid>[^/]+)/$', views.disarm, name='arm'),
    re_path(r'control/flyto/(?P<droneid>[^/]+)/(?P<lat>[^/]+)/(?P<lon>[^/]+)/(?P<alt>[^/]+)/$', views.fly_to,
        name='fly-to'),
    re_path(r'update-fields/$', views.update_fields, name='update-fields'),
    re_path(r'get-available-fields/$', views.get_available_fields, name='get-available-fields')
]
