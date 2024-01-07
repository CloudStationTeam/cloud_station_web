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
VFR_HUD='VFR_HUD'
GLOBAL_POSITION_INT = 'GLOBAL_POSITION_INT'

USEFUL_MESSAGES_V4_0_PYTHON = [
      HEARTBEAT,
      SYS_STATUS,
      SYSTEM_TIME,
      VFR_HUD
     ]

# helper functions

def handle_mavlink_message_to_update_Django_drone_object(msg):
    message_type = msg.get_type() # parse message type
    if(message_type == HEARTBEAT):
        pass
        # MAV_TYPE 	Vehicle or component type. 
        # base_mode	uint8_t	MAV_MODE_FLAG	System mode bitmap.
        # base_mode:
        # Value	Field Name	Description
        # 128	MAV_MODE_FLAG_SAFETY_ARMED
        # custom_mode	uint32_t		A bitfield for use for autopilot-specific flags
        # print(f"Flight Mode: {msg.custom_mode}")
    if(message_type == SYS_STATUS):
        pass
        # voltage_battery	uint16_t	mV		Battery voltage, UINT16_MAX: Voltage not sent by autopilot
        # current_battery	int16_t	cA		Battery current, -1: Current not sent by autopilot
        # battery_remaining	int8_t	%		Battery energy remaining, -1: Battery remaining energy not sent by autopilot
    if(message_type == SYSTEM_TIME):
        pass
        #Field Name	Type	Units	Description
        #time_unix_usec	uint64_t	us	Timestamp (UNIX epoch time).
        #time_boot_ms	uint32_t	ms	Timestamp (time since system boot)
    if(message_type == GLOBAL_POSITION_INT):
        #time_boot_ms	# uint32_t	ms	Timestamp (time since system boot).
        #lat	# int32_t	degE7	Latitude, expressed
        #lon	# int32_t	degE7	Longitude, expressed
        #alt	# int32_t	mm	Altitude (MSL). Note that virtually all GPS modules provide both WGS84 and MSL.
        #relative_alt #	int32_t	mm	Altitude above ground
        #vx	# int16_t	cm/s	Ground X Speed (Latitude, positive north)
        #vy	# int16_t	cm/s	Ground Y Speed (Longitude, positive east)
        #vz	# int16_t	cm/s	Ground Z Speed (Altitude, positive down)
        #hdg	# uint16_t	cdeg	Vehicle heading (yaw angle), 0.0..359.99 degrees. If unknown, set to: UINT16_MAX
        pass
    if(message_type == VFR_HUD):
        pass
        # Field Name	Type	Units	Description
        # airspeed	float	m/s	Vehicle speed in form appropriate for vehicle type. For standard aircraft this is typically calibrated airspeed (CAS) or indicated airspeed (IAS) - either of which can be used by a pilot to estimate stall speed.
        # groundspeed	float	m/s	Current ground speed.
        # heading	int16_t	deg	Current heading in compass units (0-360, 0=north).
        # throttle	uint16_t	%	Current throttle setting (0 to 100).
        # alt	float	m	Current altitude (MSL).
        # climb	float	m/s	Current climb rate.



# consumer functions


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
        print('[LOG] message received in Django!: ',text_data)  
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
                    handle_mavlink_message_to_update_Django_drone_object(msg)
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

