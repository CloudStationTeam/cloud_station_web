#Ref: https://www.google.com/url?sa=t&source=web&rct=j&url=https://m.youtube.com/watch%3Fv%3DpAAN055XCxA&ved=2ahUKEwj03caIgOD_AhUsFzQIHVINBBAQwqsBegQIDRAG&usg=AOvVaw2Au-9lEOkDjD9Yx4806mrN
#!/usr/bin/env python3 ?

import math 
from pymavlink import mavutil 

import socket 

import time

#add logs
from . import log1
#log1.print1(s)
#read Error e in web first. then log in cmd line. then sitl in mavproxy.

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
        n=1;
        while not msg:
            connect_address = 14550
            log1.print1(str({'ERROR'+str(n): f'No heartbeat from {connect_address} (timeout 6s)', 'droneid': connect_address}))
            msg = mavlink.wait_heartbeat(timeout=6)
            log1.print1("whatever is "+str(n))
            n+=1
        #if is_disarm:
        if not mavlink.motors_armed():
            #'''
            mavlink.mav.command_long_send( #doc. https://ardupilot.org/dev/docs/mavlink-arming-and-disarming.html
                mavlink.target_system,
                mavlink.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, #ex. https://www.ardusub.com/developers/pymavlink.html#armdisarm-the-vehicle
                0, # conf.
                1, # arm.
                #0,
                21196, # force arming or disarming
                0, 0, 0, 0, 0) # irrelevant.
            mavlink.motors_armed_wait()
            #'''
            #mavlink.arducopter_arm()

            #wait to arm.
            log1.print1("Before arm");
            #mavlink.motors_armed_wait() #too slow. timed out.
            #log1.print1("After arm");
            start_time = time.time()
            n1 = 1
            while True:
                time.sleep(1)  # Delay for 1 sec
                curr_time = time.time()
                if curr_time - start_time >= 60 or mavlink.motors_armed(): #wait for 1 min.
                    break
                print(str(n1))
                n1+=1
            log1.print1("After arm");
                  
            if not mavlink.motors_armed():
                print("whatever Not.")
                return {'ERROR': 'Not.'}
        else:
            print("whatever No.")
            return {'ERROR': 'No.'}
        ack(mavlink, "COMMAND_ACK")
        return "itsdone"
  except Exception as e:
        print(e)
        stre = str(e)
        return str({'// // // // ERROR': 'Arm/Disarm command failed!' + stre, 'droneid': connect_address})

# Main Function
#if __name__ == "__main__":
def main1(): #done.
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
  mission_item(0, 0, 42.434193622721835, -83.98098183753619, 10).wt("2 whatever")
  mission_waypoints.append(mission_item(0, 0, 42.434193622721835, -83.98098183753619, 10)) # Above takeoff point

  mission_waypoints.append(mission_item(1, 0, 42.43432724637685, -83.98613425948624, 10)) # Above Destination Point

  mission_waypoints.append(mission_item(2, 0, 42.43432724637685, -83.98613425948624, 5)) # Destination Point

  upload_mission(the_connection, mission_waypoints)
         
  #arm(the_connection)
  arm1(the_connection)
         
  takeoff(the_connection)

  start_mission(the_connection)

  item_seq = 0
  for mission_item1 in mission_waypoints:
    #print("Message Read" + str(the_connection.recv_match(type="MISSION_ITEM_REACHED", condition='MISSION_ITEM_REACHED.seq=={0}'.format(item_seq)))) #Ref: chatgpt.
    item_seq += 1
  
  #msg = set_return(the_connection)

  #return msg

#Ref: online webs.

