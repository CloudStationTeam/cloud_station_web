from background_task import background
from pymavlink import mavutil
from datetime import datetime
from flight_data_collect.models import Telemetry_log, Location_log
from flight_data_collect.drone_communication import mavlink_constants 
from flightmonitor.consumers import UserActionsConsumer

TIME_INTERVAL = 3.5  # second(s)

def connect_mavlink(connect_address: str)->str:
    try:
        mavlink = mavutil.mavlink_connection(connect_address)
        msg = mavlink.wait_heartbeat(timeout=8)
        if msg: # msg is of MAVLink_heartbeat_message type
            return 'Heartbeat Received'
        else:
            return ''
    except OSError as e:
        print(e)
        return ''

@background(schedule=0)
def get_mavlink_messages_periodically(connect_address):
    mavlink = mavutil.mavlink_connection(connect_address)
    msg = mavlink.wait_heartbeat(timeout=8)
    if msg:
        _log_latest_orientation(mavlink)
        # _log_latest_location(mavlink)
        # log_latest_gps_status(mavlink)

def _log_latest_orientation(mavlink):
    msg = _get_mavlink_message(mavlink, mavlink_constants.ORIENTATION_MESSAGE_NAME) 
    if msg:
        Telemetry_log.objects.create(timestamp = datetime.now(), \
            roll = round(msg.roll,2), pitch = round(msg.pitch,2), yaw = round(msg.yaw,2))
    
def _log_latest_location(mavlink):
    if mavlink:
        msg = _get_mavlink_message(mavlink, mavlink_constants.GPS_STATUS_MESSAGE_NAME)
        if msg:
            Location_log.objects.create(timestamp = datetime.now(), \
                latitude=msg.lat, longitude=msg.lon, altitude=msg.alt, heading=msg.hdg)

def _get_mavlink_message(mavlink, message_name)->dict:
    try:
        msg = mavlink.recv_match(message_name, blocking=True, timeout=5)
        if msg.get_type() != 'BAD_DATA':
            return msg
    except Exception as e:
        print(e)