# webgms/routing.py
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from flightmonitor.consumers import UserActionsConsumer

from django.urls import include, re_path

#from django.conf.urls import url # not available in Django 5
# see https://stackoverflow.com/questions/70319606/importerror-cannot-import-name-url-from-django-conf-urls-after-upgrading-to

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter([
            re_path(r'ws/flightmonitor/$', UserActionsConsumer)
        ])
    ),
})
