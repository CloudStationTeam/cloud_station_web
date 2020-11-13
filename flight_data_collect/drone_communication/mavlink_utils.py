from pymavlink import mavutil
from datetime import datetime
from flight_data_collect.models import Vehicle, Telemetry_log, Location_log
from flight_data_collect.drone_communication import mavlink_constants
from flight_data_collect.utils import push_log_to_client
from flightmonitor.consumers import send_message_to_clients
import socket
import json

SERVER_IP = socket.gethostbyname(socket.gethostname())


def check_vehicle_heartbeat(connect_address: str) -> bool:
    try:
        push_log_to_client('Checking heartbeat')
        if connect_address[0].isdigit():
            mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + connect_address)
        else:
            mavlink = mavutil.mavlink_connection(connect_address)
        msg = mavlink.wait_heartbeat(timeout=6)
        if msg:
            send_message_to_clients(json.dumps({'msg': 'HEARTBEAT RECEIVED', 'droneid': int(connect_address)}))
            return True
    except OSError as e:
        print(e)
    return False


def get_mavlink_messages(connect_address):
    mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + connect_address)
    timeout_count = 0
    while (Vehicle.objects.get(droneid=connect_address).is_connected):
        for msg_type in mavlink_constants.USEFUL_MESSAGES:
            msg = _get_mavlink_message(mavlink, msg_type, connect_address)
            if msg and 'ERROR' not in msg:
                timeout_count = max(0, timeout_count - 1)  # decrement by 1 if timeout_count > 0
                if msg.get("mavpackettype", "") == mavlink_constants.GPS_RAW_INT and _is_gps_fix(msg):
                    location_msg = _get_mavlink_message(mavlink, mavlink_constants.GLOBAL_POSITION_INT, connect_address)
                    if location_msg:
                        parse_mavlink_msg(location_msg, mavlink)
                        send_message_to_clients(json.dumps(location_msg))
                parse_mavlink_msg(msg, mavlink)
            else:
                timeout_count += 1
                mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + connect_address)
            send_message_to_clients(json.dumps(msg))
            if timeout_count > 10:
                send_message_to_clients(json.dumps(
                    {'ERROR': 'Disconnected because of continous timeout.', 'droneid': int(connect_address)}))
                v = Vehicle.objects.get(droneid=connect_address)
                v.is_connected = False
                v.save()
                break


def _is_gps_fix(msg) -> bool:
    fix_type = int(msg.get("fix_type", "0"))
    if fix_type >= 2:  # 2D_fix
        return True
    return False


def parse_mavlink_msg(msg, mavlink):
    msg_type = msg.get("mavpackettype", "")
    if msg_type == mavlink_constants.GPS_RAW_INT:
        msg["fix_type"] = mavutil.mavlink.enums['GPS_FIX_TYPE'][msg['fix_type']].description
    elif msg_type == mavlink_constants.HEARTBEAT:
        msg['flightmode'] = mavlink.flightmode
        msg['type'] = mavlink_constants.MAV_TYPE_MAP.get(mavlink.mav_type, 'UNKNOWN')
    elif msg_type == mavlink_constants.GLOBAL_POSITION_INT:
        msg['lon'], msg['lat'] = msg['lon'] / 10 ** 7, msg['lat'] / 10 ** 7


def _log_latest_orientation(msg, drone_id):
    if msg:
        Telemetry_log.objects.create(timestamp=datetime.now(),
                                     roll=round(msg['roll'], 2), pitch=round(msg['pitch'], 2), yaw=round(msg['yaw'], 2),
                                     droneid=drone_id)


def _log_latest_location(msg, drone_id):
    if msg:
        Location_log.objects.create(timestamp=datetime.now(),
                                    latitude=msg['lat'] / 10 ** 7, longitude=msg['lon'] / 10 ** 7,
                                    altitude=msg['alt'], heading=msg['hdg'], droneid=drone_id)


def _get_mavlink_message(mavlink, message_types, droneid: int) -> dict:
    try:
        msg = mavlink.recv_match(type=message_types, blocking=True, timeout=3)
        if msg and msg.get_type() != 'BAD_DATA':
            msg = msg.to_dict()
            msg["droneid"] = int(droneid)
            return msg
        else:
            return {"ERROR": f"no {message_types} received (timeout 3s)", "droneid": int(droneid)}
    except Exception as e:
        print(e)
    return {"ERROR": str(e)}
