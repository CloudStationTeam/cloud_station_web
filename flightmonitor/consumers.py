# flightmonitor/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from flight_data_collect.models import Telemetry_log
import channels.layers
from django.db.models.signals import post_save
from django.dispatch import receiver
from flight_data_collect.models import Telemetry_log
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

    # def receive(self, text_data):
        
    #     if msg and msg.get_type() != 'BAD_DATA':
    #         Telemetry_log.objects.create(

    #     # Send message to room group
    #     async_to_sync(self.channel_layer.group_send)(
    #         self.room_group_name,
    #         {
    #             'type': 'chat_message',
    #             'message': message
    #         }
    #     )

    def send_message(self, event):
        # Send message to WebSocket
        message = event['message']
        print('sent:', message)
        self.send(text_data=json.dumps({
            'message': message
        })) 

    # send flight log update to user (browser)
    @staticmethod
    @receiver(post_save, sender=Telemetry_log)
    def telemetryLogUpdate_observer(sender, instance, **kwargs):
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'users_group', 
            {
                'type': 'send.message',
                'message': str(instance)
            }
        )

