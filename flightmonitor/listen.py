
from pymavlink import mavutil
from asgiref.sync import async_to_sync
import json
from channels.generic.websocket import WebsocketConsumer
from flight_data_collect.models import Telemetry_log
from flight_data_collect.models import Vehicle
import channels.layers
from django.db.models.signals import post_save
from django.dispatch import receiver
from flight_data_collect.models import Telemetry_log, Location_log
from asgiref.sync import async_to_sync
import time
from datetime import datetime
import socket
from channels.generic.websocket import WebsocketConsumer
from . import listen
HEARTBEAT = "HEARTBEAT"
SYS_STATUS='SYS_STATUS'
SYSTEM_TIME='SYSTEM_TIME'
VFR_HUD='VFR_HUD'
GLOBAL_POSITION_INT = 'GLOBAL_POSITION_INT'

USEFUL_MESSAGES_V4_0_PYTHON = [
      HEARTBEAT,
      SYS_STATUS,
      SYSTEM_TIME,
      VFR_HUD,
      GLOBAL_POSITION_INT
     ]

def listenfunction_example():
    print('hello world from thread')

def listenfunction(droneid_to_listen_to, mavlinkconnection, websocket_to_send_to):
    vehicle_to_listen_to = Vehicle.objects.get(droneid=droneid_to_listen_to)

    while vehicle_to_listen_to.is_connected: # now get all messages and log to terminal
    

        msg = mavlinkconnection.recv_match( blocking=True)
        #msg = mavlink.recv_match(type='GPS_RAW_INT', blocking=True)
        #handle_mavlink_message_to_update_Django_drone_object(msg, connect_address)
        message_type = msg.get_type() # parse message type


        if(message_type in USEFUL_MESSAGES_V4_0_PYTHON):
            #print('[LOG][consumers.py] received message_type in USEFUL_MESSAGES_V4_0_PYTHON at time ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            #print('msg = ',msg)
            websocket_to_send_to.send(msg.to_json()) # Send MAVLink message as a JSON string to the WebSocket client
        vehicle_to_listen_to.refresh_from_db()
        print(' vehicle_to_listen_to.is_connected= ',droneid_to_listen_to,vehicle_to_listen_to.is_connected,vehicle_to_listen_to)
        # if it is disconnect now, close mavlink
        if(vehicle_to_listen_to.is_connected==False):
            mavlinkconnection.close()
