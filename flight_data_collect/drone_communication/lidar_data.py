from pymavlink import mavutil
import time
import socket 


def find_vacant_channel(master):
    # Retrieve RC_CHANNELS message
    msg = master.recv_match(type='RC_CHANNELS', blocking=True)

    # Iterate through RC channel values to find vacant channels
    vacant_channels = []
    for i in range(1, msg.chancount + 1):
        # Check if the channel value is unassigned or unused
        if msg['chan{}_raw'.format(i)] == 0:
            vacant_channels.append(i)
            return i

    #print("Vacant channels: ", vacant_channels)

    #if not len(vacant_channels):
    return -1

def find_switch_threshold(master, channel_number):
    # Monitor the state of the switch to determine the threshold value
    initial_state = None

    while initial_state is None:
        msg = master.recv_match(type='RC_CHANNELS', blocking=True)
        switch_value = getattr(msg, "chan{}_raw".format(channel_number), None)

        if switch_value is not None:
            initial_state = switch_value
            print("Initial switch value:", initial_state)

    # Determine the threshold value based on the initial state
    threshold_value = initial_state - 100  # Adjust the threshold offset as needed
    print("Threshold value:", threshold_value)

    return threshold_value

def toggle_avoidance_system(master, channel_number, threshold_value):
    # Set the RCx_OPTION parameter to 40 (replace x with the vacant channel number)
    rc_option_param = "RC{}_OPTION".format(channel_number)
    master.param_set(rc_option_param, 40)

    # Monitor the state of the switch
    while True:
        msg = master.recv_match(type='RC_CHANNELS', blocking=True)
        switch_value = getattr(msg, "chan{}_raw".format(channel_number), None)

        if switch_value is not None and switch_value > threshold_value:
            # Activate the avoidance system
            print("Avoidance system activated")
            # Your code to activate the avoidance system goes here
        else:
            # Deactivate the avoidance system
            print("Avoidance system deactivated")
            # Your code to deactivate the avoidance system goes here

def format_param_message(param_name, param_value, success):
    if success:
        return f"Parameter {param_name} was successfully set to {param_value}"
    else:
        return f"Failed to set parameter {param_name}"

def print_param(mav, param_name, param_value):
    # Request the current value of the parameter
    mav.param_fetch_one(param_name)

    # Wait for the parameter value to be received
    while mav.param(param_name) is None:
        msg = mav.recv_match(type='PARAM_VALUE', blocking=True)

    # Check if the parameter value matches the value we tried to set
    success = mav.param(param_name) == param_value
    print(format_param_message(param_name, param_value, success))

def config_lidar(): #or other proximity sensors.
    print("D1")
    # Connect to the autopilot
    #master = mavutil.mavlink_connection('udpout:localhost:14550')
    SERVER_IP = socket.gethostbyname(socket.gethostname())
    connect_address = 14550
    master = mavutil.mavlink_connection(SERVER_IP + ':' + str(connect_address))
    print(str(SERVER_IP)+" "+str(connect_address)) #dude it's private ip...
    
    while(master.target_system == 0):
        print("Checking Heartbeat")
        
        #the_connection.wait_heartbeat()
        msg = master.wait_heartbeat(timeout=6)
        if msg:
            print(msg)
            break
    print("D2")

    # Set AVOID_ENABLE to use all sources of barrier information
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"AVOID_ENABLE",
        param_value=7,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_UINT8
    )

    #print("Message Read" + str(master.recv_match(type="COMMAND_ACK", blocking =True))
    print_param(master, "AVOID_ENABLE", 7)

    # Set PRX1_TYPE to enable using a 360-degree Lidar as a "proximity sensor"
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"PRX1_TYPE",
        param_value=15,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_UINT8
    )

    print_param(master, "PRX1_TYPE", 15)

    # Set AVOID_MARGIN to control the distance from the barrier
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"AVOID_MARGIN",
        param_value=5,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_REAL32
    )

    print_param(master, "AVOID_MARGIN", 5)

    # Set AVOID_BEHAVE to control avoidance behavior
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"AVOID_BEHAVE",
        param_value=1,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_UINT8
    )

    print_param(master, "AVOID_BEHAVE", 1)

    print("D3")
    # Loop and listen for LIDAR messages
    for _ in range(10):
        msg = master.recv_match(type='DISTANCE_SENSOR', blocking=True)
        formatted_distance = f"LIDAR distance: {msg.current_distance} meters"
        print(formatted_distance)
        time.sleep(1)  # Sleep for 1 second

    print("lidar data done")
        
    #No avoidance if switch_value is low. Optional.
    #TODO.
    #https://ardupilot.org/copter/docs/common-simple-object-avoidance.html
    return 
    vacant_channel = find_vacant_channel(master)
    if vacant_channel == -1:
        return

    switch_threshold = find_switch_threshold(master, vacant_channel)
    
    # Set RCx_OPTION to 40
    toggle_avoidance_system(master, vacant_channel, switch_threshold)

#Refs.
#https://ardupilot.org/copter/docs/common-simple-object-avoidance.html
#online webs.

#This is to send fake distance data (note to use rand()) from gcs to the drone. But could config. by sitl instead.
#https://www.ardusub.com/developers/pymavlink.html
#https://github.com/ArduPilot/ardupilot/blob/master/Tools/autotest/arducopter.py#L6881

#could send data the other way. but may require concurrency.

