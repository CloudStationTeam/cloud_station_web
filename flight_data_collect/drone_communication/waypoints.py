#Ref: https://www.google.com/url?sa=t&source=web&rct=j&url=https://m.youtube.com/watch%3Fv%3DpAAN055XCxA&ved=2ahUKEwj03caIgOD_AhUsFzQIHVINBBAQwqsBegQIDRAG&usg=AOvVaw2Au-9lEOkDjD9Yx4806mrN
#!/usr/bin/env python3

import math 
from pymavlink import mavutil 

import socket 

import time

#add logs
from . import log1
#log1.print1(s)
#read Error e in web first. then log in cmd line. then sitl in mavproxy.
from . import points 

# Class for formating the Mission Item.
class mission_item: #done.
  def __init__ (self, i, current, x,y,z):
    self.seq = i
    self.frame = mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT # Use Global Latitude and Longitude for position data
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
  def wt(self, s):
    print(s)

#Arm the Drone
def arm(the_connection): #done.
    print("Arming")
    
    the_connection.mav.command_long_send(the_connection.target_system, the_connection.target_component,
mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0,0,0,0,0,0) # 0 conf, 1 arm, else irrelevant.
    
    ack(the_connection, "COMMAND_ACK")
        
#Takeoff the Drone
def takeoff(the_connection): #done.
  print("Takeoff Initaited")
  
  the_connection.mav.command_long_send(the_connection.target_system, the_connection.target_component, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, math.nan, 0, 0, 10)

  ack(the_connection, "COMMAND_ACK")

# Upload the mission items to the drone
def upload_mission(the_connection, mission_items): #done.
  n=len(mission_items)
  print("Sending Message out")

  the_connection.mav.mission_count_send(the_connection.target_system, the_connection.target_component, n, 0)
    
  ack(the_connection, "MISSION_REQUEST")
      
  for waypoint in mission_items: #Mission Item created based on the Mavlink Message protocol
    print("Creating a waypoint")
    the_connection.mav.mission_item_send(the_connection.target_system, #Target System
                                         the_connection.target_component, #Target Component
                                         waypoint.seq, #Sequence
                                         waypoint.frame, #Frane
                                         waypoint.command, #Command
                                         waypoint.current, #Current
                                         waypoint.auto, #Autocontinue
                                         waypoint.param1, #Hold Time
                                         waypoint.param2, #Accept Radius
                                         waypoint.param3, #Pass Radius
                                         waypoint.param4, #Yaw
                                         waypoint.param5, #local X
                                         waypoint.param6, #Local Y
                                         waypoint.param7, #local 2
                                         waypoint.mission_type) #Mission Type
      
  if waypoint != mission_items[n-1]:
    ack(the_connection, "MISSION_REQUEST")

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

#arm1. sitl shows arm failed.
def arm1(mavlink):
  try:
        msg = mavlink.wait_heartbeat(timeout=6)
        n=1
        while(mavlink.target_system == 0) or n>3: #not msg:
            connect_address = 14550
            log1.print1(str({'ERROR'+str(n): f'No heartbeat from {connect_address} (timeout 6s)', 'droneid': connect_address}))
            msg = mavlink.wait_heartbeat(timeout=6)
            log1.print1("whatever is "+str(n))
            n+=1
        log1.print1("whatever. arm1 2.")

        # Delete later
        # Set sensor health status manually. bypass all of them.
        mavlink.mav.command_long_send(
          mavlink.target_system,  # target_system
          mavlink.target_component,  # target_component
          mavutil.mavlink.MAV_CMD_PREFLIGHT_SET_SENSOR_OFFSETS,  # command
          0,  # confirmation
          0, 0, 0, 0, 0, 0, 0  # params 1-7 (set according to your sensor setup)
        )
         
        # Delete later
        # Set the ARMING_CHECK parameter to 0 to disable all checks. bypass it.
        mavlink.param_set_send('ARMING_CHECK', 0)

        # Delete later
        # Set the vehicle mode to GUIDED
        #mavlink.set_mode_guided() #no such method.
    
        #if is_disarm:
        if not mavlink.motors_armed():
            #'''
            log1.print1("Before arm")
            mavlink.mav.command_long_send( #doc. https://ardupilot.org/dev/docs/mavlink-arming-and-disarming.html
                mavlink.target_system,
                mavlink.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, #ex. https://www.ardusub.com/developers/pymavlink.html#armdisarm-the-vehicle
                0, # conf.
                1, # arm.
                21196, # force arming or disarming. else 0. # Delete later
                0, 0, 0, 0, 0) # irrelevant.
            #mavlink.motors_armed_wait()
            log1.print1("After arm")
            #'''
            #mavlink.arducopter_arm() #doesn't work.

            #bug. don't know why.
            '''
            # Wait for acknowledgment
            ack1 = mavlink.recv_match(type='COMMAND_ACK', blocking=True)
            log1.print1("whatever. 1. "+str(ack1.result))
            if ack1.result != mavutil.mavlink.MAV_RESULT_ACCEPTED:         
              print("Arming failed: " + str(ack1.result))
              return "not done"
            else:
              print("Arming successful")
              return "itsdone"
            '''
          
            #taking too long. don't know why.
            #ack(mavlink, "COMMAND_ACK")

            #why does it autoly Disarm? maybe wait to long.
            #maybe is armed buggy. assume it's armed and go from there.

            if not mavlink.motors_armed():
              print("Arming failed")
            else:
              print("Arming successful")
              return "itsdone"

            #wait to arm.
            log1.print1("Before wait arm")
            #mavlink.motors_armed_wait() #too slow. timed out.
            #log1.print1("After arm")
            start_time = time.time()
            n1 = 1
            #while True:
            while not mavlink.motors_armed():
                time.sleep(1)  # Delay for 1 sec
                #mavlink.arducopter_arm()
                curr_time = time.time()
                if curr_time - start_time >= 3 or mavlink.motors_armed(): #wait for 1 min. #3 mins do not work.
                    break
                if curr_time - start_time >= n1:
                  print(str(n1))
                  n1+=1
            log1.print1("After wait arm")

            #just return
            return ("idk. armed.")
                  
            if not mavlink.motors_armed():
                print("whatever. Not.")
                return {'ERROR': 'Not.'}
        else:
            print("whatever. No.")
            return {'ERROR': 'No.'}
        ack(mavlink, "COMMAND_ACK")
        print("whatever. itsdone.")
        return "itsdone"
  except Exception as e:
        print(e)
        stre = str(e)
        connect_address = 14550
        return str({'// // // // ERROR': 'Arm/Disarm command failed!' + stre, 'droneid': connect_address})

# Main Function
#if __name__ == "__main__":
def main1(addrList): #done.
  #return "???" + url
  print("Program Started")

  #the_connection = mavutil.mavlink_connection('udpin:localhost:14550') #("34.194.163.6:14550") #url
  #return str(the_connection)

  SERVER_IP = socket.gethostbyname(socket.gethostname())
  connect_address = 14550
  the_connection = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
  print(str(SERVER_IP)+" "+str(connect_address)) #dude it's private ip...
  
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
  mission_waypoints.append(mission_item(0, 0, 33.643633, -117.841689, 10)) # Above takeoff point

  mission_waypoints.append(mission_item(1, 0, 33.642831,-117.841283, 10)) # Above Destination Point

  mission_waypoints.append(mission_item(2, 0, 33.642919,-117.839280, 5)) # Destination Point
  """

  #"""
  #ex.
  address1 = '5200 Engineering Service Rd, Irvine, CA 92617'
  address2 = '5001 Newport Coast Dr, Irvine, CA 92603'
  address3 = '401 E. Peltason Drive, Irvine, CA 92617'
  #addrList = [address1, address2, address3]
  #"""
  n = 0
  for addr in addrList:
    lat, lon, alt = points.get_lat_lon_alt(addr)
    print(lat, lon, alt)
    mission_waypoints.append(mission_item(n, 0, lat, lon, alt))
    n += 1
    
  upload_mission(the_connection, mission_waypoints)
         
  log1.print1("whatever. upload_mission done") #put whatever here, cuz log format didn't work.
  
  arm(the_connection)
  '''
  arm2 = arm1(the_connection)

  log1.print1("whatever. arm1 done")

  if arm2 != "itsdone":
    #return "no arm1" + str(arm2) 
    log1.print1("whatever. cont.")
  '''
  
  takeoff(the_connection)

  log1.print1("whatever. takeoff done")

  start_mission(the_connection)

  log1.print1("whatever. start_mission done")

  item_seq = 0
  for mission_item1 in mission_waypoints:
    print("Message Read" + str(the_connection.recv_match(type="MISSION_ITEM_REACHED", condition='MISSION_ITEM_REACHED.seq=={0}'.format(item_seq)))) #Ref: chatgpt.
    item_seq += 1

  #don't do it. otherwise it won't move.
  '''
  msg = set_return(the_connection)

  log1.print1("whatever. set_return done")

  return msg
  '''

#Ref: online webs.

