
#seq 0. else invalid seq.
#wp0123. else no wp1.
#count 4. else no wp3.
#wp3 away. alt low. Land. else does not Land.

#seq 0. wp0123. wp3 not. count 4. wp3 alt 0.


#Ref: https://www.google.com/url?sa=t&source=web&rct=j&url=https://m.youtube.com/watch%3Fv%3DpAAN055XCxA&ved=2ahUKEwj03caIgOD_AhUsFzQIHVINBBAQwqsBegQIDRAG&usg=AOvVaw2Au-9lEOkDjD9Yx4806mrN
#!/usr/bin/env python3

import math 
from pymavlink import mavutil 

import socket 

import time

#add logs
from . import logs
from . import points 

from . import mavlink_control as mc

# Class for formating the Mission Item.
class mission_item: #done.
  def __init__ (self, i, current, x,y,z):
    self.seq = i
    self.frame = mavutil.mavlink.MAV_FRAME_GLOBAL # MAV_FRAME_GLOBAL_RELATIVE_ALT # Use Global Latitude and Longitude for position data
    self.command = mavutil.mavlink.MAV_CMD_NAV_WAYPOINT # Move to the waypoint
    self.current = current
    self.auto = 1 #auto cont.
    self.param1 = 0 # arr. radius, etc.
    self.param2 = 2.00
    self.param3 = 20.00
    self.param4 = math.nan
    self.param5 = x
    self.param6 = y
    self.param7 = z
    self.mission_type = 0 # The MAV MISSION TYPE value for MAV MISSION TYPE MISSION 

#set it to auto mode
def set_auto(the_connection):
  # Switch to auto mode
  the_connection.mav.command_long_send(
    the_connection.target_system,    # Target system ID (can be 1 for the autopilot itself)
    the_connection.target_component, # Target component ID (can be 1 for the autopilot itself)
    mavutil.mavlink.MAV_CMD_DO_SET_MODE, # MAVLink command to set mode
    0,    # Confirmation
    mavutil.mavlink.MAV_MODE_AUTO_ARMED, # Auto mode
    0,    # Custom mode (not used for auto mode)
    0, 0, 0, 0, 0 # Parameters (not used for auto mode)
  )
  ack(the_connection, "COMMAND_ACK")

#Arm the Drone
def arm(the_connection): #done.
    print("Arming")
    
    the_connection.mav.command_long_send(the_connection.target_system, the_connection.target_component,
mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0,0,0,0,0,0) # 0 conf, 1 arm, else irrelevant.
    
    ack(the_connection, "COMMAND_ACK")

    """
    n = 1
    #while True:
    while not mavlink.motors_armed() and n<10:
      time.sleep(1)
      print("wait arm"+str(n))
      n+=1
    """
        
#Takeoff the Drone
def takeoff(the_connection): #done.
  print("Takeoff Initaited")
  
  the_connection.mav.command_long_send(the_connection.target_system, the_connection.target_component, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, math.nan, 0, 0, 10)

  ack(the_connection, "COMMAND_ACK")

# Upload the mission items to the drone
def upload_mission(the_connection, mission_items):
    n = len(mission_items)
    print("wp. Total waypoints: ", n)
    print("Sending Mission Count")

    the_connection.mav.mission_count_send(the_connection.target_system, the_connection.target_component, n, 0)
  
    for waypoint in mission_items:
        print("wp. No. num=",
          waypoint.seq,
          waypoint.param5, #local X
          waypoint.param6, #Local Y
          waypoint.param7) #local 2
      
        req = the_connection.recv_match(type="MISSION_REQUEST", blocking=True, timeout=6)
        if req and req.seq == waypoint.seq:
            print("wp. Sending waypoint", waypoint.seq)
            the_connection.mav.mission_item_send(
                the_connection.target_system,
                the_connection.target_component,
                waypoint.seq,
                waypoint.frame,
                waypoint.command,
                waypoint.current,
                waypoint.auto,
                waypoint.param1,
                waypoint.param2,
                waypoint.param3,
                waypoint.param4,
                waypoint.param5,
                waypoint.param6,
                waypoint.param7,
                waypoint.mission_type
            )
        else:
            print("wp. Error: Waypoint request mismatch or timeout.")
            break

    ack(the_connection, "MISSION_ACK")














# Send message for the drone to return to the launch point
def set_return(the_connection): #done.
  print("Set Return To launch")
  
  the_connection.mav.command_long_send(the_connection.target_system, the_connection.target_component, mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, 0, 0, 0, 0, 0, 0, 0, 0)
    
  ack(the_connection, "COMMAND_ACK")

  return str(the_connection.recv_match(type="COMMAND_ACK", blocking =True))

# Start mission
def start_mission(the_connection): #done.
  print("Mission Start")
  
  the_connection.mav.command_long_send(the_connection.target_system, the_connection.target_component,
mavutil.mavlink.MAV_CMD_MISSION_START, 0, 0, 0, 0, 0, 0, 0, 0)
        
  ack(the_connection, "COMMAND_ACK")

# Acknoledgement from the Drone
def ack(the_connection, keyword): #done.
  print("Message Read" + str(the_connection.recv_match(type=keyword, blocking =True)))


# Main Function
#if __name__ == "__main__":
def add(addrList=None): #done.
  print("Program Started")

  SERVER_IP = socket.gethostbyname(socket.gethostname())
  connect_address = 14550
  the_connection = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
  print(str(SERVER_IP)+" "+str(connect_address))
  
  while(the_connection.target_system == 0):
    print("Checking Heartbeat")

    #the_connection.wait_heartbeat()
    msg = the_connection.wait_heartbeat(timeout=6)
    if msg:
      print(msg)
      break

    print("heartbeat from system (system %u component %u)" % (the_connection.target_system, the_connection.target_component))

  mission_waypoints = []

  #TODO: map pins.
  '''
  mission_item(0, 0, 42.434193622721835, -83.98098183753619, 10).wt("2 whatever")
  mission_waypoints.append(mission_item(0, 0, 42.434193622721835, -83.98098183753619, 10)) # Above takeoff point

  mission_waypoints.append(mission_item(1, 0, 42.43432724637685, -83.98613425948624, 10)) # Above Destination Point

  mission_waypoints.append(mission_item(2, 0, 42.43432724637685, -83.98613425948624, 5)) # Destination Point
  '''

  """
  #n=1
  mission_waypoints.append(mission_item(0, 0, 33.643633, -117.841689, 10)) # Above takeoff point
  #mission_waypoints.append(mission_item(2

  mission_waypoints.append(mission_item(1, 0, 33.642831,-117.841283, 10)) # Above Destination Point

  mission_waypoints.append(mission_item(2, 0, 33.642919,-117.839280, 5)) # Destination Point
  """

  #"""
  #ex.
  address1 = '1. 5200 Engineering Service Rd, Irvine, CA 92617'
  address2 = '2. 5001 Newport Coast Dr, Irvine, CA 92603'
  address3 = '3. 401 E. Peltason Drive, Irvine, CA 92617'
  #addrList = [address1, address2, address3]
  if not addrList:
    addrList = [address2]
  addrList = [address1] + addrList
  print(addrList)
  #"""

  #"""
  tups = [(33.643335, -117.842163, 500), # a place 
          #(33.643633, -117.841689, 10), #wp1
          (33.642831,-117.841283, 10), #wp2
          (33.643633, -117.841689, 0)]
          #(33.642919,-117.839280, 5)] #wp3
  #try wp0. 2. 
  #seq 1 didn't work. - invalid seq num.
  #3 wps. no wp0. - goes to wp2, wp3 (skips wp1)
  #4 wps. wp0. - goes to wp1, wp2 
  #3 wps. count 2.
  #2 wps.
  #addrList = [address1, address2] #n=2
  #"""
  count = len(tups)
  
  n = 0 # ??? #TODO
  """
  Therefore, if you explicitly want to set the home position yourself, you would typically include a waypoint with sequence 0. If you don't include it, the system may automatically create one for you, depending on the specifics of your autopilot system.
  
  That's why it flights around.
  """
  #"""
  #for addr in addrList:
  for _ in range(count):
    #"""
    #lat, lon, alt = points.get_lat_lon_alt(addr[3:])
    #free map api timed out. #No.
    lat, lon, alt = tups[n]
    alt = 5
    #"""
    
    """
    lat, lon = points.get_lat_lon(addr[3:])
    alt = 5
    """
    
    print("Now. ", lat, lon, alt)

    #arm it, then
    #def fly_to_point(connect_address: int, lat, lon, alt):
    #mc.fly_to_point(the_connection, lat, lon, alt)
  
    mission_waypoints.append(mission_item(n, 0, float(lat), float(lon), int(alt)))
    n += 1
  #"""
  
  #return
  print("wp.")
    
  upload_mission(the_connection, mission_waypoints)
         
  print("wp. upload_mission done") #put whatever here, cuz log format didn't work.

  arm(the_connection)
  '''
  msg = arm1(the_connection)

  print("wp. arm1 done")

  if msg != "done":
    #return "no arm1" + str(msg)) 
    print("wp. cont.")
  '''

  set_auto(the_connection)
  takeoff(the_connection)

  print("wp. takeoff done")

  start_mission(the_connection)

  print("wp. start_mission done")

  item_seq = 1 # ???
  for mission_item1 in range(len(mission_waypoints)-1):
    print("Message Read" + str(the_connection.recv_match(type="MISSION_ITEM_REACHED", condition='MISSION_ITEM_REACHED.seq=={0}'.format(item_seq), blocking =True))) #Ref: chatgpt.
    item_seq += 1

  """
  for mission_item1 in range(len(mission_waypoints)-1): #wp123
    ack(the_connection, "MISSION_ITEM_REACHED")
  """

  #don't do it. otherwise it won't move.
  
  msg = set_return(the_connection)

  print("wp. set_return done")

  return msg
  

#Ref: online webs.

