from background_task import background
from pymavlink import mavutil
from datetime import datetime
from flight_data_collect.models import Telemetry_log, Location_log
from flight_data_collect.drone_communication import mavlink_constants 
from flightmonitor.consumers import send_message_to_clients
import socket
SERVER_IP = socket.gethostbyname(socket.gethostname())

TIME_INTERVAL = 3.5  # second(s)

def connect_mavlink(connect_address: str)->bool:
    try:
        mavlink = mavutil.mavlink_connection(SERVER_IP+':'+connect_address) # hackish fix for now
        msg = mavlink.wait_heartbeat(timeout=8)
        return msg is not None
    except OSError as e:
        print(e)
    return False

@background(schedule=0)
def get_mavlink_messages_periodically(connect_address):
    mavlink = mavutil.mavlink_connection(SERVER_IP+':'+connect_address)
    msg = mavlink.wait_heartbeat(timeout=8)
    if msg:
        _log_latest_orientation(mavlink, connect_address)
        _log_latest_location(mavlink, connect_address)

def _log_latest_orientation(mavlink, drone_id):
    msg = _get_mavlink_message(mavlink, mavlink_constants.ORIENTATION_MESSAGE_NAME) 
    if msg:
        Telemetry_log.objects.create(timestamp = datetime.now(), \
            roll = round(msg.roll,2), pitch = round(msg.pitch,2), yaw = round(msg.yaw,2), 
            droneid=drone_id)
    
def _log_latest_location(mavlink, drone_id):
    # FIXME
    # This seems to be a bug in pymavlink the message names are wrong
    # It could also be a problem of how we are using pymavlink (Dialect)
    global_position_int = _get_mavlink_message(mavlink, mavlink_constants.GPS_RAW_INT)
    # send_message_to_clients(str(gps_raw_int))
    # global_position_int = _get_mavlink_message(mavlink, mavlink_constants.GLOBAL_POSITION_INT)
    Location_log.objects.create(timestamp = datetime.now(), \
        latitude=global_position_int.lat/10**7, longitude=global_position_int.lon/10**7, \
        altitude=global_position_int.alt, heading=global_position_int.hdg, droneid=drone_id)

def _get_mavlink_message(mavlink, message_name)->dict:
    try:
        msg = mavlink.recv_match(message_name, blocking=True, timeout=4)
        if msg.get_type() != 'BAD_DATA':
            return msg
    except Exception as e:
        print(e)