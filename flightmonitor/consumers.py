# flightmonitor/consumers.py
from pymavlink import mavutil
from asgiref.sync import async_to_sync
import json
from channels.generic.websocket import WebsocketConsumer
from flight_data_collect.models import Telemetry_log
import channels.layers
from django.db.models.signals import post_save
from django.dispatch import receiver
from flight_data_collect.models import Telemetry_log, Location_log
from asgiref.sync import async_to_sync
import time
from datetime import datetime
import socket

#from flightmonitor.drone_communication.mavlink_utils import check_vehicle_heartbeat

HEARTBEAT = "HEARTBEAT"
SYS_STATUS='SYS_STATUS'
SYSTEM_TIME='SYSTEM_TIME'
LOCAL_POSITION_NED='LOCAL_POSITION_NED'
VFR_HUD='VFR_HUD'
POWER_STATUS = 'POWER_STATUS'
GLOBAL_POSITION_INT = 'GLOBAL_POSITION_INT'
MISSION_CURRENT='MISSION_CURRENT'

USEFUL_MESSAGES_V4_0_PYTHON = [
      HEARTBEAT,
      SYS_STATUS,
      SYSTEM_TIME,
      LOCAL_POSITION_NED,
      GLOBAL_POSITION_INT,
      MISSION_CURRENT,
      VFR_HUD
     ]

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

    def receive(self, text_data):
        # text_data_json = json.loads(text_data)
        # message = text_data_json["message"]
        # self.send(text_data=json.dumps({"message": message}))
        print('[LOG] message received in Django!')
        print(text_data)
        if(text_data=='CONNECT123'):
            print('going to connect to drone now!')
            # do something, like call connect to mavlink            
            connect_address='14559'
            # PRIVATE IP
            # Create a socket to get the local machine's hostname
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))  # Connect to a known external server (Google's public DNS)
            # Get the local IP address
            private_ip = s.getsockname()[0]
            # Close the socket
            s.close()
            print('[LOG] PRIVATE IP = ' + private_ip)
            SERVER_IP = socket.gethostbyname(socket.gethostname())
#            print('[LOG] SERVER_IP_TEST='+SERVER_IP_TEST)
            #SERVER_IP = '127.0.0.1'
            #SERVER_IP = '192.168.1.124'
            #mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + connect_address)
            mavlink = mavutil.mavlink_connection(private_ip + ':' + connect_address)
            msg = mavlink.wait_heartbeat(timeout=6)
            if msg:
                # connection succeded
                print('[LOG] Mavlink connection successful!')
            else:
                print('LOG] ERROR Mavlink connection NOT successful!')
            # now get all messages and log to terminal
            while True:
                msg = mavlink.recv_match( blocking=True)
                #msg = mavlink.recv_match(type='GPS_RAW_INT', blocking=True)
                # parse message type
                message_type = msg.get_type()
                if(message_type in USEFUL_MESSAGES_V4_0_PYTHON):
                    print('[LOG][consumers.py] message_type in USEFUL_MESSAGES_V4_0_PYTHON')
                    print(msg)
                    # Convert MAVLink message to a dictionary
                    msg_dict = msg.to_dict()
                    # Send MAVLink message as a JSON string to the WebSocket client
                    self.send(msg.to_json())
                    # Get the current date and time
                    current_datetime = datetime.now()
                    # Format the date and time as a string
                    formatted_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
                    # Print the formatted date and time
                    print("Current Date and Time:", formatted_datetime)
                    #self.send(f"Message sent at time " + formatted_datetime)
                

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

