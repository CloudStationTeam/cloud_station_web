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
from channels.generic.websocket import WebsocketConsumer

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

# helper functions

class UserActionsConsumer(WebsocketConsumer):
     def connect(self):
         self.channel_layer.group_add(
            "users_group", 
            self.channel_name
        )
         self.accept()

     def disconnect(self, close_code):
         self.channel_layer.group_discard(
            "users_group", 
            self.channel_name
        )

     def send_message(self, event):
        message = event['message'] # Send message to WebSocket
        print('sent:', message)
        self.send(text_data=json.dumps({
            'message': message
        }))


    # Receive message from WebSocket
     def example_receive(self, text_data):
        print(text_data)
        # Send message to room group
        self.send(text_data)

     def receive(self, text_data):
        print('[LOG] message received in Django!')
        print(text_data)
        print('[LOG] running   self.send(text_data)')
        self.send(text_data) # Send MAVLink message as a JSON string to the WebSocket client
        print('[LOG] did run   self.send(text_data)')
        if(text_data=='CONNECT123'):
            print('going to connect to drone now!')
            connect_address='14559'

            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))  # Connect to a known external server (Google's public DNS)
            private_ip = s.getsockname()[0] # Get the local IP address
            s.close() # Close the socket
            print('[LOG] PRIVATE IP = ' + private_ip)

            SERVER_IP = socket.gethostbyname(socket.gethostname())
            #mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + connect_address)
            mavlink = mavutil.mavlink_connection(private_ip + ':' + connect_address)
            connect_msg = mavlink.wait_heartbeat(timeout=6)

            if connect_msg: # connection succeded
                print('[LOG] Mavlink connection successful!')

                while True: # now get all messages and log to terminal

                    msg = mavlink.recv_match( blocking=True)
                    #msg = mavlink.recv_match(type='GPS_RAW_INT', blocking=True)
                    message_type = msg.get_type() # parse message type

                    if(message_type in USEFUL_MESSAGES_V4_0_PYTHON):
                        print('[LOG][consumers.py] received message_type in USEFUL_MESSAGES_V4_0_PYTHON at time ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                        print('msg = ',msg)
                        self.send(msg.to_json()) # Send MAVLink message as a JSON string to the WebSocket client
            else:
                print('LOG] ERROR Mavlink connection NOT successful!')

                




















     def old_receive(self, text_data):
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
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))  # Connect to a known external server (Google's public DNS)
            private_ip = s.getsockname()[0] # Get the local IP address
            s.close() # Close the socket
            print('[LOG] PRIVATE IP = ' + private_ip)
            SERVER_IP = socket.gethostbyname(socket.gethostname())
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

