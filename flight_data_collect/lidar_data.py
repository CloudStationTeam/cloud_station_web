from pymavlink import mavutil

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

# Set PRX1_TYPE to enable using a range finder as a "proximity sensor"
master.mav.param_set_send(
    target_system=1,
    target_component=1,
    param_id=b"PRX1_TYPE",
    param_value=4,
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

