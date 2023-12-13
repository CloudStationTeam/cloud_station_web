

# Notes to wps. 
"""
example wps:
wp seq=0,1,2,3. else invalid seq num.
wp0,1,2,3. wp0=start_loc. else no wp1. 
wp3 not too far off. else does not go to wp3. 
wps count=4. else no wp3. 
Land it. else does not Land.
"""


"""
example process:

If Not AUTO: 
mode GUIDED,
arm the drone and wait for it to be armed, 
send waypoints,
mode AUTO,
goto waypoints,
mode LAND.

If AUTO: 
send waypoints,
mode AUTO,
goto waypoints,
mode LAND.
"""


"""
bug to remove:
does not print when it reaches to a wp. 
"""


#Ref: https://www.google.com/url?sa=t&source=web&rct=j&url=https://m.youtube.com/watch%3Fv%3DpAAN055XCxA&ved=2ahUKEwj03caIgOD_AhUsFzQIHVINBBAQwqsBegQIDRAG&usg=AOvVaw2Au-9lEOkDjD9Yx4806mrN
#!/usr/bin/env python3

import math 
from pymavlink import mavutil 

import socket 

import time

#add logs
from . import logs
from . import points 

#from . import mavlink_control as mc #didn't work 

AUTO = 1 # False



def set_mode(the_connection, mode):
    mode_id = the_connection.mode_mapping()[mode.upper()]

    # Check if mode change is possible
    if mode_id is not None:
        # Send the command to change the mode
        the_connection.mav.set_mode_send(
            the_connection.target_system,
            mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
            mode_id)
        return f"Mode change to {mode} command sent."
    else:
        return "Invalid mode."


def set_arm(the_connection, arm=True):
    try:
        # Arming/Disarming the UAV
        the_connection.mav.command_long_send(
            the_connection.target_system,
            the_connection.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            1 if arm else 0,
            0, 0, 0, 0, 0, 0)
        #time.sleep(1) #Do Not Wait #Again, do Not wait even 1s. otherwise it won't work. 
        #if wait too long, drone disarms; if wait too short, drone is not armed yet.
        #1s is too long for it to wait for. 
        return "Arm command sent." if arm else "Disarm command sent."
    except Exception as e:
        return f"Arm/Disarm command failed: {e}"




# Class for formating the Mission Item.
class mission_item: #done.
  def __init__ (self, i, current, x,y,z):
    self.seq = i
    self.frame = mavutil.mavlink.MAV_FRAME_GLOBAL # For Google Maps API 
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


"""
Notes about frames.

#Ref.
#online webs 
#https://ardupilot.org/copter/docs/common-mavlink-mission-command-messages-mav_cmd.html
    
If you're trying to set a waypoint using lat, lon, and alt,
you'd typically specify the frame of reference.
Common frames in MAVLink (which PyMavLink uses) include:

MAV_FRAME_GLOBAL: For global coordinates (latitude and longitude). This frame uses the WGS84 coordinate system where altitude is relative to mean sea level.
MAV_FRAME_GLOBAL_RELATIVE_ALT: For global coordinates with relative altitude.
MAV_FRAME_LOCAL_NED: For local coordinates (North, East, Down).

The choice of frame depends on your specific application and the coordinate system you want to use.

Google Maps API generally provides the absolute latitude and longitude,
and the altitude is often at sea level,
which aligns well with MAV_FRAME_GLOBAL.
However, if your application involves relative altitude
(e.g., flying a certain height above the ground or a structure),
MAV_FRAME_GLOBAL_RELATIVE_ALT would be more appropriate.
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

        attempts = 1
        req = None
        while not req and attempts < 4:
            req = the_connection.recv_match(type="MISSION_REQUEST", blocking=True, timeout=6)
            print("wp. attempts. ", attempts)
            attempts += 1
            
            # Arm the UAV Again
            if AUTO:
                msg = set_arm(the_connection)
                print("wp. arm. ", msg)
        
        if req and req.seq == waypoint.seq:
            print("wp. Sending waypoint", waypoint.seq)
            the_connection.mav.mission_item_send( # Send a waypoint to the drone. 
                the_connection.target_system,
                the_connection.target_component,
                waypoint.seq, # Sequence number of the waypoint 
                waypoint.frame, # The frame of reference 
                waypoint.command, # The command, in this case, to navigate to a waypoint 
                waypoint.current, # Current waypoint 
                waypoint.auto, # Autocontinue to next waypoint 
                waypoint.param1, # Parameters 1-4 not used 
                waypoint.param2,
                waypoint.param3,
                waypoint.param4,
                waypoint.param5, # Parameters 5-7 are latitude, longitude, altitude 
                waypoint.param6,
                waypoint.param7,
                waypoint.mission_type
            )
        else:
            if req:
                print("wp. seq. ", req, req.seq, waypoint.seq)
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
def add(connect_address: int, addrList: list): #done. #(, is_points=False) 
  print("Program Started")

  SERVER_IP = socket.gethostbyname(socket.gethostname())
  #connect_address = 14550
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

  '''
  mission_waypoints.append(mission_item(0, 0, 42.434193622721835, -83.98098183753619, 10)) # Above takeoff point

  mission_waypoints.append(mission_item(1, 0, 42.43432724637685, -83.98613425948624, 10)) # Above Destination Point

  mission_waypoints.append(mission_item(2, 0, 42.43432724637685, -83.98613425948624, 5)) # Destination Point
  '''

  # example addrs 
  """
  addr_1 = "Donald Bren Hall, Irvine, CA, USA"
  addr1 = "Engineering Hall, Irvine, CA, USA"
  addr2 = "Calit2, Irvine, CA, USA"
  addr3 = "RapidTech, Campus Drive, Irvine, CA, USA"
  addr4 = addr2
  addr5 = addr3
  addrList = [addr_1, addr1, addr2, addr3] # DBH, ENG HALL, CALTELI2, RapidTech, CALTELI2, RapidTech 
  """
    
  tups = []

  """
  if is_points: #[(1,2,3),(1,2,3)] 
      tups = addrList
      addrList = []
  """

  #from .points import test 
  #test()

  print("wp. addrList. ", addrList)
  for addr in addrList:
      print("wp. addr. ", addr)
      lst = addr.replace(' ', '').split(',') #addrList=["1.1,2,3","1.1,2,3"] 
      #all_ints = all(isinstance(item, int) for item in lst)
      all_ints = all(item.replace('-', '', 1).replace('.', '', 1).isdigit() for item in lst)
      if len(lst)>=2 and len(lst)<=3 and all_ints: #everything are ints. 
          if len(lst)<3:
              alt = points.get_alt(lst)
              if not alt:
                  alt = 10
              lst.append(alt)
          tup = tuple(float(i) for i in lst)
          print("wp. tup1. ", tup)
          
      else: #addr="1 Shields Ave., Davis, CA." 
          lat, lon, alt = points.get_gps_and_altitude_by_location(addr) # send API reqs before wps. 
          tup = (lat, lon, alt)
          print("wp. tup2. ", tup)
      
      tups.append(tup)
  print("wp. tups.", tups)

  # Wait for the API reqs.
  while len(tups) < len(addrList):
      print("wp. wait. ", tups)
      #time.sleep(1)
    
  count = len(tups)
  
  n = 0 
  """
  Therefore, if you explicitly want to set the home position yourself, you would typically include a waypoint with sequence 0. If you don't include it, the system may automatically create one for you, depending on the specifics of your autopilot system.
  
  That's why it skipped wp1.
  """

  for _ in range(count):
    lat, lon, alt = tups[n]

    # Safety Checks
    """
    if alt > 100:
        print("invalid alt.")
    """
    
    print("Now. ", lat, lon, alt)

    mission_waypoints.append(mission_item(n, 0, float(lat), float(lon), int(alt)))
    n += 1

  print("wp.")


  # Set mode GUIDED. otherwise couldn't arm. 
  if AUTO:
      msg = set_mode(the_connection, 'GUIDED')
      print("wp. guided. ", msg)


  # Arm the UAV
  if AUTO:
      msg = set_arm(the_connection)
      print("wp. arm. ", msg)

  
  upload_mission(the_connection, mission_waypoints)
         
  print("wp. upload_mission done") #put whatever here, cuz log format didn't work.

    
  # Set mode AUTO. after wps.    
  if AUTO:
      msg = set_mode(the_connection, 'AUTO')
      print("wp. auto. ", msg)


  takeoff(the_connection)

  print("wp. takeoff done")

  start_mission(the_connection)

  print("wp. start_mission done")

    
  """
  item_seq = 1 # ???
  for mission_item1 in range(len(mission_waypoints)-1):
    print("Message Read" + str(the_connection.recv_match(type="MISSION_ITEM_REACHED", condition='MISSION_ITEM_REACHED.seq=={0}'.format(item_seq), blocking =True))) #Ref: chatgpt.
    item_seq += 1
  """

    
  """
  for mission_item1 in range(len(mission_waypoints)-1): #wp123
    ack(the_connection, "MISSION_ITEM_REACHED")
    print("wp. to wp. ", mission_item1) #Does Not Show 
  """

    
  """
  def ack_wp(): 
      nonlocal the_connection 
      keyword = "MISSION_ITEM_REACHED"
      print(f"Waiting for {keyword} message...")
      message = the_connection.recv_match(type=keyword, blocking=True, timeout=6) # otherwise auto times out. 
      if message:
          print("Message Received:", message)
          return message 
      else:
          print(f"No {keyword} message received within timeout period.")
          return None
          
  for mission_item1 in range(len(mission_waypoints)-1): #wp123 
      msg = None
      while not msg:
          msg = ack_wp()
      print(f"wp. to wp. {mission_item1}", msg)
  """
  
  
  attempts = 1
  while attempts < 1: # Not a bug. 
    # Receive messages
    msg = the_connection.recv_match(blocking=True)
    attempts += 1

    # Check if the message is 'MISSION_ITEM_REACHED'
    if msg and msg.get_type() == 'MISSION_ITEM_REACHED':
        # Print the sequence number of the waypoint reached
        print(f"Reached waypoint: {msg.seq}")
        if msg.seq == len(mission_waypoints)-1:
            break 

    elif msg:
        print("wp. msg.", msg) # It doesn't send a wp reached msg. 

    
  """
  # Set mode LAND. It disarms.  
  if AUTO:
      msg = set_mode(the_connection, 'LAND')
      print("wp. land. ", msg)
  """  

    
  #Don't do it yet. otherwise it won't go to wps. 
  """
  msg = set_return(the_connection)

  print("wp. set_return done")

  # Set mode LAND. It disarms.  
  if AUTO:
      msg = set_mode(the_connection, 'LAND')
      print("wp. land. ", msg)

  return msg
  """

#Ref: online webs.

