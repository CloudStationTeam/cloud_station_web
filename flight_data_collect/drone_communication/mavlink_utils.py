from background_task import background
from pymavlink import mavutil
from datetime import datetime
from flight_data_collect.models import Telemetry_log, Location_log
import flight_data_collect.drone_communication.mavlink_constants 
mavlink = None

def connect_mavlink(connect_address: str)->bool:
    global mavlink
    try:
        mavlink = mavutil.mavlink_connection(connect_address)
        return True
    except OSError as e:
        print(e)
        return False

@background(schedule=0)
def get_mavlink_messages_periodically():
    _log_latest_orientation()
    _log_latest_location()
    # log_latest_gps_status()

def _log_latest_orientation():
    msg = _get_mavlink_message(mavlink_constants.ORIENTATION_MESSAGE_NAME)   
    if msg:
        Telemetry_log.objects.create(timestamp = datetime.now(), \
            roll = round(msg.roll,2), pitch = round(msg.pitch,2), yaw = round(msg.yaw,2))
    
def _log_latest_location():
    msg = _get_mavlink_message(mavlink_constants.GPS_STATUS_MESSAGE_NAME)
    if msg:
        Location_log.objects.create(timestamp = datetime.now(), \
            latitude=msg.lat, longitude=msg.lon, altitude=msg.alt, heading=msg.hdg)

def _get_mavlink_message(message_name)->dict:
    try:
        msg = mavlink.messages[message_name]
        if msg.get_type() != 'BAD_DATA':
            return msg
    except:
        return ""