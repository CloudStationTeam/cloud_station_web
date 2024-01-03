# flightmonitor/consumers.py
from asgiref.sync import async_to_sync
import json
from channels.generic.websocket import WebsocketConsumer
from flight_data_collect.models import Telemetry_log
import channels.layers
from django.db.models.signals import post_save
from django.dispatch import receiver
from flight_data_collect.models import Telemetry_log, Location_log
from asgiref.sync import async_to_sync

class UserActionsConsumer(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            "users_group", 
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            "users_group", 
            self.channel_name
        )
        # self.send(text_data='connection closed')

    def send_message(self, event):
        # Send message to WebSocket
        message = event['message']
        print('sent:', message)
        self.send(text_data=json.dumps({
            'message': message
        })) 

# send flight log update to client (browser)
@receiver(post_save, sender=Telemetry_log)
def telemetryLogUpdate_observer(sender, instance, **kwargs):
    send_message_to_clients(str(instance))

@receiver(post_save, sender=Location_log)
def locationLogUpdate_observer(sender, instance, **kwargs):
    send_message_to_clients(str(instance))


def send_message_to_clients(msg):
    channel_layer = channels.layers.get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'users_group',
        {
            'type': 'send.message',
            'message': msg
        }
    )

