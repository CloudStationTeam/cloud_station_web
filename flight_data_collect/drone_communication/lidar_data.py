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
    # Set the RCx_OPTION parameter to 40 (replace x with the vacant channel number)
    rc_option_param = "RC{}_OPTION".format(channel_number)
    master.param_set(rc_option_param, 40)

    # Monitor the state of the switch and find the threshold value
    threshold_value = None

    print(f"Toggle the switch associated with channel {channel_number} to the HIGH position.")
    while threshold_value is None:
        msg = master.recv_match(type='RC_CHANNELS', blocking=True)
        threshold_value = msg.getattr(f"chan{channel_number}_raw")
    print(f"Threshold value for HIGH position: {threshold_value}")

    print(f"Toggle the switch associated with channel {channel_number} to the LOW position.")
    while threshold_value is not None:
        msg = master.recv_match(type='RC_CHANNELS', blocking=True)
        if msg.getattr(f"chan{channel_number}_raw") < threshold_value:
            threshold_value = None
    print(f"Threshold value for LOW position: {threshold_value}")

def main1():
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

    n = find_vacant_channel(master)
    
    # Set RCx_OPTION to 40
    if n != -1:
        find_switch_threshold(master, n)


