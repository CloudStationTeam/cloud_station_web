from pymavlink import mavutil
import socket
SERVER_IP = socket.gethostbyname(socket.gethostname())

def change_vehilce_mode(connect_address:int, mode:str)->bool:
    try:
        mavlink = mavutil.mavlink_connection(SERVER_IP+':'+connect_address)
        mavlink.set_mode(mode)
        return True
    except Exception as e:
        print(e)
    return False

def set_waypoint(connect_address:int, waypoint)->bool:
    pass

