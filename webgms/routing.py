# webgms/routing.py
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from flightmonitor.consumers import UserActionsConsumer
from django.conf.urls import url

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter([
            url(r'ws/flightmonitor/$', UserActionsConsumer)
        ])
    ),
})