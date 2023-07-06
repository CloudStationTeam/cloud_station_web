from pymavlink import mavutil, mavwp
import socket
import json
from flight_data_collect.drone_communication.mavlink_constants import MAVLINK_MSG_ID_SET_MODE
from flightmonitor.consumers import send_message_to_clients
import time

#import flight_data_collect.drone_communication.smt
from . import waypoints
from . import log1
from . import lidar_data

SERVER_IP = socket.gethostbyname(socket.gethostname())


def get_ack_msg(connect_address: int, mavlink, message_type, should_send=False, command_name=None):
    ack_msg = mavlink.recv_match(type=message_type, timeout=6, blocking=True)
    if ack_msg:
        ack_msg = ack_msg.to_dict()
        ack_msg["droneid"] = connect_address
        if 'result' in ack_msg:
            ack_msg['result_description'] = mavutil.mavlink.enums['MAV_RESULT'][ack_msg['result']].description
        if command_name:
            ack_msg['command'] = command_name
        if should_send:
            send_message_to_clients(json.dumps(ack_msg))
    return ack_msg


def change_mode(connect_address: int, mode: str) -> str:
    #print("1 whatever") #done. 
    #return "print"
    try:
        mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
        msg = mavlink.wait_heartbeat(timeout=6)
        connect_address = int(connect_address)
        if not msg:
            return str({'ERROR': f'No heartbeat from {connect_address} (timeout 6s)', 'droneid': connect_address})
        if mode not in mavlink.mode_mapping():
            return str({'ERROR': f'{mode} is not a valid mode. Try: {list(mavlink.mode_mapping().keys())}',
                        'droneid': connect_address})
        mavlink.set_mode(mode)
        ack_msg = mavlink.recv_match(type='COMMAND_ACK', condition=f'COMMAND_ACK.command=={MAVLINK_MSG_ID_SET_MODE}',
                                     blocking=True, timeout=6)
        if ack_msg:
            ack_msg = ack_msg.to_dict()
            ack_msg['command'] = 'SET_MODE'
            ack_msg['result_description'] = mavutil.mavlink.enums['MAV_RESULT'][ack_msg['result']].description
            ack_msg['droneid'] = connect_address
            return ack_msg
        else:
            return str({'ERROR': 'No ack_msg received (timeout 6s).', 'droneid': connect_address})
    except Exception as e:
        print(e)
        return str({'ERROR': 'Set Mode command failed!', 'droneid': connect_address})


def set_waypoints(connect_address: int, waypoints: list) -> str: #bool: ???
    """waypoints should be given in this form:
        [(lat0,lon10,alt0), (lat1,lon1,alt1), ...]"""
    try:
        mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
        mavlink.wait_heartbeat(timeout=6)
        wp = mavwp.MAVWPLoader()
        seq = 1
        frame = mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT
        radius = 1
        waypoints = [(0, 0, 0)] + waypoints
        for i, waypoint in enumerate(waypoints):
            wp.add(mavutil.mavlink.MAVLink_mission_item_message(mavlink.target_system,
                                                                mavlink.target_component,
                                                                seq,
                                                                frame,
                                                                mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
                                                                0, 0, 0, radius, 0, 0,
                                                                waypoint[0], waypoint[1], waypoint[2]))
            seq += 1

        mavlink.waypoint_clear_all_send()
        ack_msg = get_ack_msg(connect_address, mavlink, ['WAYPOINT_REQUEST', 'MISSION_ACK', 'MISSION_REQUEST'],
                              should_send=True, command_name='WAYPOINT_CLEAR_ALL')
        mavlink.waypoint_count_send(wp.count())
        for i in range(wp.count()):
            ack_msg = get_ack_msg(connect_address, mavlink, ['WAYPOINT_REQUEST', 'MISSION_ACK', 'MISSION_REQUEST'],
                                  should_send=True)
            mavlink.mav.send(wp.wp(ack_msg['seq']))
        ack_msg = get_ack_msg(connect_address, mavlink, ['WAYPOINT_REQUEST', 'MISSION_ACK', 'MISSION_REQUEST'])
        return str(ack_msg)
    except Exception as e:
        return("ERROR: "+str(e))
        print(e)
        return {'ERROR': 'Set waypoint failed!' + str(e), 'droneid': connect_address}


def set_arm(connect_address: int, is_disarm=False):
    #return {'ERROR': str(connect_address)}
    try:
        #return "???    Hello? " + "str(SERVER_IP)" + ':' + str(connect_address)
        #mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
        msg = log1.log11() #done.
        #return msg
        
        print("smt")
        msg = waypoints.main1() #just debug line by line.
        if not msg:
            msg = "None"
        print(msg)
        return "// // // // " + str(msg)
    except Exception as e:
        print(e)
        stre = str(e)
        return str({'// // // // ERROR': 'Arm/Disarm command failed!' + stre, 'droneid': connect_address})

    
    try:
        str1 = set_waypoints(connect_address, [(0,11,0)])
        if str1[0] == "E":
            return str1 #Don't use str as a var name.
        mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
        msg = mavlink.wait_heartbeat(timeout=6)
        if not msg:
            return {'ERROR': f'No heartbeat from {connect_address} (timeout 6s)', 'droneid': connect_address}
        if is_disarm:
            '''
            mavlink.mav.command_long_send(
                mavlink.target_system,
                mavlink.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
                0,
                1, 0, 0, 0, 0, 0, 0)
            mavlink.motors_armed_wait()
            '''
            mavlink.arducopter_arm()
            #mavlink.motors_armed_wait()
            start_time = time.time()
            while True:
                if time.time() - start_time >= 10 or mavlink.motors_armed():
                    break
            if not mavlink.motors_armed():
                return {'ERROR': 'Not.'}
        else:
            return {'ERROR': 'No.'}
            '''
            mavlink.mav.command_long_send(
                mavlink.target_system,
                mavlink.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
                0,
                0, 0, 0, 0, 0, 0, 0)
            mavlink.motors_disarmed_wait()
            '''
        ack_msg = get_ack_msg(connect_address, mavlink, 'COMMAND_ACK')
        if ack_msg:
            return ack_msg
        else:
            return {'ERROR': 'No ack_msg received (timeout 6s).', 'droneid': connect_address}
    except Exception as e:
        print(e)
        return {'ERROR': 'Arm/Disarm command failed!' + str(e), 'droneid': connect_address}


def fly_to_point(connect_address: int, lat, lon, alt):
    try:
        lidar_data.config_lidar()
        return 
        
        mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
        msg = mavlink.wait_heartbeat(timeout=6)
        if not msg:
            return {'ERROR': f'No heartbeat from {connect_address} (timeout 6s)', 'droneid': connect_address}
        frame = mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT
        mavlink.mav.mission_item_send(
            0, 0, 0, frame,
            mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 2, 0, 0,
            0, 0, 0, lat, lon, alt)
        ack_msg = get_ack_msg(connect_address, mavlink, 'MISSION_ACK')
        if ack_msg:
            return ack_msg
        else:
            return {'ERROR': 'No ack_msg received (timeout 6s).', 'droneid': connect_address}
    except Exception as e:
        print(e)
        return {'ERROR': str(e), 'droneid': connect_address}

#addrList=[] #static 
def update_waypoints(connect_address: int, addr: str):
    print("wp") #reached.
    try:
        #return "???    Hello? " + "str(SERVER_IP)" + ':' + str(connect_address)
        #mavlink = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
        msg = log1.log11() #done.
        #return msg
        
        print("smt")
        """
        global addrList
        addrList.append(address)
        if len(addrList) < 3:
            return 
        print("addrList "+addrList)
        """
        addrList = [addr]
        msg = waypoints.main1(addrList) #just debug line by line.
        #addrList = []
        if not msg:
            msg = "None"
        print(msg)
        return "// // // // " + str(msg)
    except Exception as e:
        print(e)
        stre = str(e)
        return str({'// // // // ERROR': 'Arm/Disarm command failed!' + stre, 'droneid': connect_address})

    

