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
import gc
#from flightmonitor.drone_communication.mavlink_utils import check_vehicle_heartbeat
# test comment for commit from office desktop 1 19 2024
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

def create_list_of_all_droneids_in_database():
    # Retrieve all objects of YourModel
    all_objects = Vehicle.objects.all()
    list_of_all_droneids_in_database=[]
    # Print or iterate through the objects
    for obj in all_objects:
        print('[create_list_of_all_droneids_in_database] vehicle =',obj)
        droneid_str=str(obj.droneid)
        list_of_all_droneids_in_database.append(droneid_str)
    print('[create_list_of_all_droneids_in_database] list_of_all_droneids_in_database =', list_of_all_droneids_in_database)
    return list_of_all_droneids_in_database


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


def vechicle_disconnect(drone_id_to_connect_to): 
    if(is_vehicle_in_database(drone_id_to_connect_to)): # mark as disconnected if in database and return
        vehicle_to_disconnect = Vehicle.objects.get(droneid=drone_id_to_connect_to)
        vehicle_to_disconnect.is_connected=False
        vehicle_to_disconnect.save()
        return
    else: # not in database, just return
        return

def connect_vehicle_by_ip_and_port(drone_id_to_connect_to,DRONE_IP_TO_CONNECT_TO,websocket_to_push_to):
    #comment

    # * is pseudo code:
    # * create DRONE_IP_TO_CONNECT_TO, DRONE_PORT = drone_id_to_connect_to
    DRONE_PORT_TO_CONNECT_TO=str(drone_id_to_connect_to) # string
    private_ip=get_local_ip()
    print('[LOG] PRIVATE IP = ' + private_ip)
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
        print('drone listed as connected in database and in thread,')
        return

    # * if drone listed as not connected in database and in thread, mark as connected in database and return
    if vehicle_to_listen_to.is_connected==False and is_drone_id_is_in_a_thread(drone_id_to_connect_to)==True:
        print('drone listed as not connected in database and in thread,')
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
            vehicle_to_listen_to.is_connected=True
            vehicle_to_listen_to.save()
            # Create a thread
            threadname=str(DRONE_PORT_TO_CONNECT_TO)
            my_thread = threading.Thread(target=listenfunction, args=(DRONE_PORT_TO_CONNECT_TO, mavlink, websocket_to_push_to),name=threadname)
            #my_thread = threading.Thread(target=listenfunction)
            # Start the thread
            my_thread.start()
        else:
            print('LOG] ERROR Mavlink connection NOT successful!')
            mavlink.close()

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

     def disconnect(self, close_code): # 
        print('[UserActionsConsumer:disconnect] disconnected websocket')
        # typically this happens when user reloads webpage, maybe also internet loss
        # in this case, mark drone is not connected so listen.py thread will stop; also wait 200 ms for it to stop
        # actually do this for all threads, since we lost websocket to all of them

        running_threads = threading.enumerate()  # List all running threads and check if they are connected....      
        m_list_of_droneids=create_list_of_all_droneids_in_database()
        print('[disconnect] m_list_of_droneids = ',m_list_of_droneids)
        for temp_id in m_list_of_droneids:
            print('[disconnect]  temp_id = ',temp_id)
            print('[disconnect] type(temp_id)  = ',type(temp_id)) # int
        for thread in running_threads:
            print('[UserActionsConsumer:disconnect] running threadname = ',thread.name)
            m_threadname=thread.name
            print('[disconnect] type(m_threadname) =',type(m_threadname)) # string
            if m_threadname in m_list_of_droneids: # mark all drone objects as disconnected                
                print('[UserActionsConsumer:disconnect] m_threadname in m_list_of_droneids; m_threadname = ',m_threadname)
                m_droneobject_to_disconnect=Vehicle.objects.get(droneid=m_threadname)
                print('[UserActionsConsumer:disconnect] found vehicle m_droneobject_to_disconnect= ',m_droneobject_to_disconnect)
                print('[UserActionsConsumer:disconnect] calling m_droneobject_to_disconnect.is_connected=False on m_droneobject_to_disconnect=',m_droneobject_to_disconnect)
                m_droneobject_to_disconnect.is_connected=False
                m_droneobject_to_disconnect.save()

                print('[UserActionsConsumer:disconnect] did call m_droneobject_to_disconnect.is_connected=False on m_droneobject_to_disconnect=',m_droneobject_to_disconnect)

        time.sleep(0.2)
        return









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
            # 1.) Figure out droneid, IP addresses
            # 2.) If drone object does not exist, create it, mark as not connected
            # 3.) If drone listed as connected in database and in thread, return


            # 1.) Figure out droneid, IP addresses
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

            # 2.) If drone object does not exist, create it, mark as not connected
            if(is_vehicle_in_database(drone_id_to_connect_to)==False): # i.e. need to create entry into database
                #create drone
                vehicle_to_listen_to = Vehicle()
                vehicle_to_listen_to.droneid=drone_id_to_connect_to
                vehicle_to_listen_to.is_connected=False
                vehicle_to_listen_to.save() 
            else: # drone is in database, get its object as vehicle_to_listen_to
                vehicle_to_listen_to=Vehicle.objects.get(droneid=drone_id_to_connect_to)

            # 3.) If drone listed as connected in database and in thread, return
            # A possible scenario is if everthing is connected, then user refreshes browser, the following happens:
            # Thread still runs on old websocket 
            # The django drone object is still listed as connected, even though it's not
            # On browswer refresh, a whole new websocket connection is established
            # But because this function thinks things are hunky dory, it quits, and the new websockect hence browser is left high and dry...
            # To avoid this scenario, the websocket disconnect listener sets ALL drone objects to is_connected=false, which will terminate ALL listen.py threads
            # effectively resetting Django to the origianl state (no listen.py threads, no drones listed as connected in database)
            if vehicle_to_listen_to.is_connected==True and is_drone_id_is_in_a_thread(drone_id_to_connect_to)==True:
                print('[UserActionsConsumer:receive] drone listed as connected in database and in thread, returning...')
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
                    comms_msg={"mavpackettype": "DRONECOMM",  "drone_remote_IP": str(sending_ip_address), "drone_local_IP": str(private_ip),"drone_port": str(drone_id_to_connect_to)} # json string
                    # Parse the JSON string into a Python dictionary

                    json_string = json.dumps({"msg": comms_msg, "port": drone_id_to_connect_to})
                    self.send(json_string) # need to update to send port also as per new format

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


        if(command_to_execute=='SETMODE') or (command_to_execute=='ARM') or (command_to_execute=='DISARM') or (command_to_execute=='TAKEOFF') or (command_to_execute=='FLYTO') : # set drone mode
            print("SETMODE received in django")
            # Psuedo code:
            # 1.) Parse mode to send and drone port.
            # 2.) Figure out IP addresses
            # 3.) Disconnect vehicle and wait 100 ms for listen.py thread to quit
            # 4.) Create drone in database if it doesn't already exist (unlikely)
            # 5.) Create mavlink connection
            # 6.) Call change mode function or arm/disarm
            # 7.) Close mavlink connection and wait 50 ms
            # 7.) Restablish mavlink connection on listen.py

            # 1.) Parse mode to send and drone port.
            DRONE_PORT_TO_CONNECT_TO=str(data['DRONE_PORT']) # string
            drone_id_to_connect_to = data['DRONE_PORT'] # Note that DRONE_PORT is drone ID for now....
            mode_to_set_int = data['MODE']
            print('drone_id_to_connect_to =', drone_id_to_connect_to)
            print('mode_to_set_int =', mode_to_set_int)

            # 2.) Figure out IP addresses
            # * create DRONE_IP_TO_CONNECT_TO, DRONE_PORT = drone_id_to_connect_to
            private_ip=get_local_ip()
            DRONE_IP_TO_CONNECT_TO=data['DRONE_IP'] # string
            if(DRONE_IP_TO_CONNECT_TO=='' or DRONE_IP_TO_CONNECT_TO=='0.0.0.0'): # or zero
                DRONE_IP_TO_CONNECT_TO=private_ip

            # 3.) Disconnect vehicle and wait 100 ms for listen.py thread to quit
            vechicle_disconnect(drone_id_to_connect_to)
            time.sleep(0.2) # thread should stop during this 100 ms ...
            #Check if thread is stopped:
            sitrepthread=is_drone_id_is_in_a_thread(drone_id_to_connect_to);
            print('is thread still around = ',sitrepthread)
            print('should be false')

            # 4.) Create drone in database if it doesn't already exist (unlikely)
            if(is_vehicle_in_database(drone_id_to_connect_to)==False): # i.e. need to create entry into database
            #create drone
                print('inside setmode , drone not in database, adding to database (should never happen)')
                vehicle_to_listen_to = Vehicle()
                vehicle_to_listen_to.droneid=drone_id_to_connect_to
                vehicle_to_listen_to.is_connected=False
                vehicle_to_listen_to.save() 
            else: # drone is in database, get its object as vehicle_to_listen_to
                vehicle_to_listen_to=Vehicle.objects.get(droneid=drone_id_to_connect_to)

            # 5.) Create mavlink connection
            # Ideally would use existing mavlink connection object, but it is in a different thread on listen.py and I don't know how to get access to it.
            mavlink = mavutil.mavlink_connection(DRONE_IP_TO_CONNECT_TO + ':' + DRONE_PORT_TO_CONNECT_TO)
            connect_msg = mavlink.wait_heartbeat(timeout=3)
            print('did call mavlink to connect')
            if connect_msg: # connection succeded
                print('[LOG] Mavlink connection successful!')
            else:
                print('LOG] ERROR Mavlink connection NOT successful!')

            # 6.) Call change mode function
            if(command_to_execute=='SETMODE')  : # set drone mode
            # change_mode_CS4(droneid_to_send_setmode_to, mavlinkconnection, websocket_to_send_response_to, mode_to_set)
                change_mode_CS4(DRONE_PORT_TO_CONNECT_TO, mavlink, 123, mode_to_set_int)                
            if (command_to_execute=='ARM')  : # arm
                mavlink.mav.command_long_send(1, 1,mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0, 0, 0, 0, 0, 0)
                arm_msg = mavlink.recv_match(type='COMMAND_ACK', blocking=True, timeout=3)
                print(f"Arm ACK:  {arm_msg}")


            if (command_to_execute=='DISARM') : # disarm
                mavlink.mav.command_long_send(1, 1,mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 0, 0, 0, 0, 0, 0, 0)
                arm_msg = mavlink.recv_match(type='COMMAND_ACK', blocking=True, timeout=3)
                print(f"Disarm ACK:  {arm_msg}")

            if (command_to_execute=='TAKEOFF') : # disarm
                print('taking off!!!!!!!!!!!')
                takeoff_altitude=mode_to_set_int
                # takeoff_altitude=40 #  hard coded for now
                takeoff_params = [0, 0, 0, 0, 0, 0, takeoff_altitude]
                mavlink.mav.command_long_send(1, 1,mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, takeoff_params[0], takeoff_params[1], takeoff_params[2], takeoff_params[3], takeoff_params[4], takeoff_params[5], takeoff_params[6])
                takeoff_msg = mavlink.recv_match(type='COMMAND_ACK', blocking=True, timeout=3)
                print(f"Takeoff ACK:  {takeoff_msg}")


            if (command_to_execute=='FLYTO') : 
                print('flyting to!!!!!!!!!!!')
                change_mode_CS4(DRONE_PORT_TO_CONNECT_TO, mavlink, 123, 4) # set to guided mode
                destination_lat = data['LAT_DEST']
                destination_lat_int = int(1e7*destination_lat)
                destination_lon = data['LON_DEST']
                destination_lon_int = int(1e7*destination_lon)
                destination_alt = data['ALT_DEST']
                print('calling flyto with ',destination_lat,destination_lon,destination_alt)

                mavlink.mav.send(mavutil.mavlink.MAVLink_set_position_target_global_int_message(10, mavlink.target_system,
                        mavlink.target_component, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, int(0b110111111000), destination_lat_int, destination_lon_int, destination_alt, 0, 0, 0, 0, 0, 0, 1.57, 0.5))

                # mavlink.mav.command_long_send(1, 1,mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, takeoff_params[0], takeoff_params[1], takeoff_params[2], takeoff_params[3], takeoff_params[4], takeoff_params[5], takeoff_params[6])
                # takeoff_msg = mavlink.recv_match(type='COMMAND_ACK', blocking=True, timeout=3)
                # print(f"Takeoff ACK:  {takeoff_msg}")

            # 7.) Close mavlink connection and wait 50 ms
            print('closing mavlink in setmode method')
            mavlink.close()
            time.sleep(0.05)

            # 7.) Restablish mavlink connection on listen.
            print('Restablish mavlink connection on listen.py')
            connect_vehicle_by_ip_and_port(drone_id_to_connect_to,DRONE_IP_TO_CONNECT_TO,self)
 




            
        if(command_to_execute=='ARM'): # set drone mode
            print("ARM received in django")



            

        if(command_to_execute=='DISARM'): # set drone mode
            print("DISARM received in django")
            
# Example usage
# all_mavlink_connections = find_mavlink_connections()
# print("All MAVLink connections:", all_mavlink_connections)

# CS 4.0 
def change_mode_CS4(droneid_to_send_setmode_to, mavlinkconnection, websocket_to_send_response_to, mode_to_set_int):
    vehicle_to_send_setmode_to = Vehicle.objects.get(droneid=droneid_to_send_setmode_to)
    try:
        # Change mode to guided (Ardupilot) 
        mode_id = mavlinkconnection.mode_mapping()["GUIDED"]
        # mode_mapping = mavlinkconnection.mode_mapping()
        # print(mode_mapping)
        m_mode_map = {'STABILIZE': 0, 'ACRO': 1, 'ALT_HOLD': 2, 'AUTO': 3, 'GUIDED': 4, 'LOITER': 5, 'RTL': 6, 'CIRCLE': 7, 'POSITION': 8, 'LAND': 9, 'OF_LOITER': 10, 'DRIFT': 11, 'SPORT': 13, 'FLIP': 14, 'AUTOTUNE': 15, 'POSHOLD': 16, 'BRAKE': 17, 'THROW': 18, 'AVOID_ADSB': 19, 'GUIDED_NOGPS': 20, 'SMART_RTL': 21, 'FLOWHOLD': 22, 'FOLLOW': 23, 'ZIGZAG': 24, 'SYSTEMID': 25, 'AUTOROTATE': 26, 'AUTO_RTL': 27}
        mavlinkconnection.mav.command_long_send( 1, 1, mavutil.mavlink.MAV_CMD_DO_SET_MODE,
                                    0, mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED, mode_to_set_int, 0, 0, 0, 0, 0)
        ack_msg = mavlinkconnection.recv_match(type='COMMAND_ACK', blocking=True, timeout=3)
        print(f"Change Mode ACK:  {ack_msg}")

        if ack_msg:
            ack_msg = ack_msg.to_dict()
            ack_msg['command'] = 'SET_MODE'
            ack_msg['result_description'] = mavutil.mavlink.enums['MAV_RESULT'][ack_msg['result']].description
            ack_msg['droneid'] = droneid_to_send_setmode_to
            print(' massaged ack_msg = ',ack_msg)
            return ack_msg
        else:
            return str({'ERROR': 'No ack_msg received (timeout 3s).', 'droneid': droneid_to_send_setmode_to})
    except Exception as e:
        print(e)
        return str({'ERROR': 'Set Mode command failed!', 'droneid': droneid_to_send_setmode_to})
    

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

