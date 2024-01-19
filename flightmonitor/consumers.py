# flightmonitor/consumers.py
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
from flightmonitor.listen import listenfunction,listenfunction_example
import threading

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
      VFR_HUD,
      GLOBAL_POSITION_INT
     ]

# helper functions
def is_vehicle_in_database(vehicle_id_to_check):
    try:
        # Attempt to get an object with the specified attribute value
        Vehicle.objects.get(droneid=vehicle_id_to_check)
        return True  # Object found in the database
    except Vehicle.DoesNotExist:
        return False  # Object not found in the database

def is_drone_id_is_in_a_thread(drone_id_to_connect_to):
    running_threads = threading.enumerate()  # List all running threads and check if they are connected....      
    # Display thread information
    #print('droneidtoconnectto = ',drone_id_to_connect_to)
    #print("Running threads:")
    for thread in running_threads:
        #print('threadname = ',thread.name)
        if(thread.name==drone_id_to_connect_to):
            print('Drone already connected! by checking threads')
            return True
    return False

def find_IP_ADDRESS_sending_to_port(port_to_receive_on):
    # Set the UDP port to listen on
    udp_port = port_to_receive_on

    # Create a UDP socket
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.bind(('0.0.0.0', udp_port))
    IP_RECEIVED_ON='0.0.0.0'

    # Set a timeout for the socket
    timeout_seconds = 1
    udp_socket.settimeout(timeout_seconds)

    try:
        # Receive data and address
        data, addr = udp_socket.recvfrom(1024)
        IP_RECEIVED_ON=addr[0]

    except socket.timeout:
        print(f"Timeout ({timeout_seconds} seconds) reached. No data received.")
        udp_socket.close()
        return IP_RECEIVED_ON

    except Exception as e:
        print(f"Error receiving data: {e}")
        udp_socket.close()
        return IP_RECEIVED_ON

    finally:
        # Close the socket
        udp_socket.close()

    return IP_RECEIVED_ON

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(('8.8.8.8', 80))  # Connect to a known external server (Google's public DNS)
    local_ip = s.getsockname()[0] # Get the local IP address
    s.close() # Close the socket
    print('[LOG] local ip = ' + local_ip)
    return local_ip



def handle_mavlink_message_to_update_Django_drone_object(msg, connect_address):
    v = Vehicle.objects.get(droneid=connect_address)

    message_type = msg.get_type() # parse message type
    if(message_type == HEARTBEAT):

    # MAV_TYPE 	Vehicle or component type. 
    #v.MAV_TYPE = ... heartbeat_message.get_type()
        print('heartbeat_message.get_type() = ' + msg.get_type())
    

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
        # Send message to back to sending websocket
        self.send(text_data)

     def receive(self, text_data):
        print('[LOG] message received in Django!: ',text_data)  
        # create list of vehicles in database
        data = json.loads(text_data)
        command_to_execute = data['command']
        print("Command:", data['command'])

        if(command_to_execute=='DISCONNECT'): # mark as disconnected if in database and return, else return
            drone_id_to_connect_to = data['droneid']
            if(is_vehicle_in_database(drone_id_to_connect_to)): # mark as disconnected if in database and return
                vehicle_to_disconnect = Vehicle.objects.get(droneid=drone_id_to_connect_to)
                vehicle_to_disconnect.is_connected=False
                vehicle_to_disconnect.save()
                return
            else: # not in database, just return
                return
  
        if(command_to_execute=='CONNECT_BY_IP_AND_PORT'): 
            # * is pseudo code:

            # * create DRONE_IP_TO_CONNECT_TO, DRONE_PORT = drone_id_to_connect_to
            DRONE_PORT_TO_CONNECT_TO=str(data['DRONE_PORT']) # string
            print("DRONE_PORT_TO_CONNECT_TO", data['DRONE_PORT']) 
            drone_id_to_connect_to = data['DRONE_PORT'] # Note that DRONE_PORT is drone ID for now....
            private_ip=get_local_ip()
            print('[LOG] PRIVATE IP = ' + private_ip)
            DRONE_IP_TO_CONNECT_TO=data['DRONE_IP'] # string
            if(DRONE_IP_TO_CONNECT_TO=='' or DRONE_IP_TO_CONNECT_TO=='0.0.0.0'): # or zero
                DRONE_IP_TO_CONNECT_TO=private_ip
            print('[LOG] DRONE_IP_TO_CONNECT_TO  = ' + DRONE_IP_TO_CONNECT_TO)

            # * if drone does not exist in database, create it
            if(is_vehicle_in_database(drone_id_to_connect_to)==False): # i.e. need to create entry into database
                #create drone
                vehicle_to_listen_to = Vehicle()
                vehicle_to_listen_to.droneid=drone_id_to_connect_to
                vehicle_to_listen_to.is_connected=False
                vehicle_to_listen_to.save() 
            else: # drone is in database, get its object as vehicle_to_listen_to
                vehicle_to_listen_to=Vehicle.objects.get(droneid=drone_id_to_connect_to)

            # * if drone listed as connected in database and in thread, return
            if vehicle_to_listen_to.is_connected==True and is_drone_id_is_in_a_thread(drone_id_to_connect_to)==True:
                return

            # * if drone listed as not connected in database and in thread, mark as connected in database and return
            if vehicle_to_listen_to.is_connected==False and is_drone_id_is_in_a_thread(drone_id_to_connect_to)==True:
                vehicle_to_listen_to.is_connected=True
                vehicle_to_listen_to.save()
                return

            # * if drone is not in thread ...
            if  is_drone_id_is_in_a_thread(drone_id_to_connect_to)==False: # create thread and mark as connected in database
                # ** Find sinding IP
                sending_ip_address=find_IP_ADDRESS_sending_to_port(int(DRONE_PORT_TO_CONNECT_TO))
                # ** Connect to drone
                print('calling mavlink to connect to IP: ' ,DRONE_IP_TO_CONNECT_TO,'PORT: ',DRONE_PORT_TO_CONNECT_TO)
                mavlink = mavutil.mavlink_connection(DRONE_IP_TO_CONNECT_TO + ':' + DRONE_PORT_TO_CONNECT_TO)
                print('working...')
                connect_msg = mavlink.wait_heartbeat(timeout=6)
                print('did call mavlink to connect')
                if connect_msg: # connection succeded
                    print('[LOG] Mavlink connection successful!')
                    # Usurp mavlink and create a new API for this project... DRONECOMM
                    comms_msg={"mavpackettype": "DRONECOMM",  "drone_remote_IP": str(sending_ip_address), "drone_local_IP": str(private_ip),"drone_port": str(drone_id_to_connect_to)}
                    self.send(json.dumps(comms_msg))
                    vehicle_to_listen_to.is_connected=True
                    vehicle_to_listen_to.save()
                    # Create a thread
                    threadname=str(DRONE_PORT_TO_CONNECT_TO)
                    my_thread = threading.Thread(target=listenfunction, args=(DRONE_PORT_TO_CONNECT_TO, mavlink, self),name=threadname)
                    #my_thread = threading.Thread(target=listenfunction)
                    # Start the thread
                    my_thread.start()
                else:
                    print('LOG] ERROR Mavlink connection NOT successful!')
                    mavlink.close()



        if(command_to_execute=='CONNECT'): # obsolete
            print('going to connect to drone now!')
            #connect_address='14559'
            connect_address=str(drone_id_to_connect_to)
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))  # Connect to a known external server (Google's public DNS)
            private_ip = s.getsockname()[0] # Get the local IP address
            s.close() # Close the socket
            print('[LOG] PRIVATE IP = ' + private_ip)

            SERVER_IP = socket.gethostbyname(socket.gethostname())
            #mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + connect_address)
            print('server_ip = ',SERVER_IP)
            print('private _ip = ', private_ip)
            #private_ip='52.13.24.228'
            #private_ip='172.16.1.16'

            print('calling mavlink to connect to IP: ' ,private_ip,'PORT: ',connect_address)
            mavlink = mavutil.mavlink_connection(private_ip + ':' + connect_address)
            print('working...')
            connect_msg = mavlink.wait_heartbeat(timeout=6)
            print('did call mavlink to connect')

            if connect_msg: # connection succeded
                print('[LOG] Mavlink connection successful!')
                vehicle_to_listen_to.is_connected=True
                vehicle_to_listen_to.save()
                # Create a thread
                threadname=str(connect_address)
                my_thread = threading.Thread(target=listenfunction, args=(connect_address, mavlink, self),name=threadname)
                #my_thread = threading.Thread(target=listenfunction)
                # Start the thread
                my_thread.start()

               
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

