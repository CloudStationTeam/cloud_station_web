from pymavlink import mavutil

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

def config_lidar(): #or other proximity sensors.
    # Connect to the autopilot
    master = mavutil.mavlink_connection('udpout:localhost:14550')

    # Set AVOID_ENABLE to use all sources of barrier information
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"AVOID_ENABLE",
        param_value=7,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_UINT8
    )

    # Set PRX1_TYPE to enable using a 360-degree Lidar as a "proximity sensor"
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"PRX1_TYPE",
        param_value=15,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_UINT8
    )

    # Set AVOID_MARGIN to control the distance from the barrier
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"AVOID_MARGIN",
        param_value=5,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_REAL32
    )

    # Set AVOID_BEHAVE to control avoidance behavior
    master.mav.param_set_send(
        target_system=1,
        target_component=1,
        param_id=b"AVOID_BEHAVE",
        param_value=1,
        param_type=mavutil.mavlink.MAV_PARAM_TYPE_UINT8
    )
    
    #below are optional.
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

