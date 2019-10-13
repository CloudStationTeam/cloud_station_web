from background_task import background
from pymavlink import mavutil
from datetime import datetime
from .models import Telemetry_log

mavlink = None

def connect_mavlink(connect_address: str)->bool:
    try:
        mavlink = mavutil.mavlink_connection(connect_address)
        return True
    except OSError as e:
        print(e)
        return False

@background(schedule=0)
def get_mavlink_messages_periodically():
    msg = mavlink.recv_match(type='ATTITUDE', blocking=True)
    #if self.__is_orientation_change_significant(msg):
    Telemetry_log.objects.create(timestamp = datetime.now(), \
    	roll = round(msg.roll,2), pitch = round(msg.pitch,2), yaw = round(msg.yaw,2))
