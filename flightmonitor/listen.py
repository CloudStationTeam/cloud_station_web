
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
        message_type = msg.get_type() # parse message type
        if(message_type in USEFUL_MESSAGES_V4_0_PYTHON): # send to browser over websocket
            # Create two dictionaries
            inner_dict = msg.to_dict();
            outer_dict = {'msg': inner_dict, 'port': droneid_to_listen_to}
            # Convert the outer dictionary to a JSON-formatted string
            json_string = json.dumps(outer_dict)
            #print("Nested JSON string:", json_string)
            websocket_to_send_to.send(json_string)

        vehicle_to_listen_to.refresh_from_db()
        #print(' vehicle_to_listen_to.is_connected= ',droneid_to_listen_to,vehicle_to_listen_to.is_connected,vehicle_to_listen_to)

        # if it is disconnect now, close mavlink
#        if(vehicle_to_listen_to.is_connected==False or websocket_to_send_to.connected==False):
        if(vehicle_to_listen_to.is_connected==False ):
            print('closing mavlink inside listen.py thread')
            mavlinkconnection.close()
