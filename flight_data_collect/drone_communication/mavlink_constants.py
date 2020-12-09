from pymavlink import mavutil

ORIENTATION_MESSAGE_NAME = 'ATTITUDE'
POWER_STATUS = 'POWER_STATUS'
GLOBAL_POSITION_INT = 'GLOBAL_POSITION_INT'
GPS_RAW_INT = 'GPS_RAW_INT'
GPS_RAW = 'GPS_RAW'
GPS_FIX_TYPE = {
    1: "GPS_NO_FIX",
    2: "GPS_2D_FIX",
    3: "GPS_3D_FIX",
    4: "GPS_FIX_TYPE_DGPS",
    5: "GPS_FIX_TYPE_RTK_FLOAT",
    6: "GPS_FIX_TYPE_RTK_FIXED",
    7: "GPS_FIX_TYPE_STATIC",
    8: "GPS_FIX_TYPE_PPP"
}
MAV_MODE = {
    0: "PREFLIGHT",
    80: "STABILIZE_DISARMED",
    208: "STABILIZE_ARMED",
    64: "MANUAL_DISARMED",
    192: "MANUAL_ARMED",
    88: "GUIDED_DISARMED",
    216: "GUIDED_ARMED",
    92: "DISARMED",
    220: "AUTO_ARMED",
    66: "TEST_DISARMED",
    194: "TEST_ARMED",
}
MAV_TYPE_MAP = {
    0: "GENERIC",
    1: "FIXED_WING",
    2: "QUADROTOR",
    3: "COAXIAL",
    4: "HELICOPTER",
    5: "ANTENNA_TRACKER",
    6: "GCS",
    7: "AIRSHIP",
    8: "FREE_BALLOON",
    9: "ROCKET",
    10: "ROVER",
    11: "BOAT",
    12: "SUBMARINE",
    13: "HEXAROTOR",
    14: "OCTOROTOR",
    15: "TRICOPTER",
    16: "FLAPPING_WING",
    17: "KITE",
    18: "ONBOARD_CONTROLLER",
    19: "VTOL_DUOROTOR",
    20: "VTOL_QUADROTOR",
    21: "VTOL_TILTROTOR",
    22: "VRTOL_RESERVED2",
    23: "VTOL_RESERVED3",
    24: "VTOL_RESERVED4",
    25: "VTOL_RESERVED5",
    26: "GIMBAL",
    27: "ADSB",
    28: "PARAFOIL",
    29: "DODECAROTOR",
    30: "CAMERA",
    31: "CHARING_STATION",
    32: "FLARM",
    33: "SERVO",
    34: "ODID",
    35: "DECAROTOR"
}
HEARTBEAT = "HEARTBEAT"

USEFUL_MESSAGES = [
    HEARTBEAT,
    ORIENTATION_MESSAGE_NAME,
    POWER_STATUS,
    GPS_RAW_INT,
]
MAVLINK_MSG_ID_SET_MODE = mavutil.mavlink.MAVLINK_MSG_ID_SET_MODE

AVAILABLE_TELEMETRY_DATA = {
    "GLOBAL_POSITION_INT": ["time_boot_ms", "lat", "lon", "alt", "relative_alt", "vx", "vy", "vz", "hdg"],
    "BATTERY_STATUS": ["id", "battery_function", "type", "temperature", "voltages", "current_battery",
                       "current_consumed", "energy_consumed", "battery_remaining", "time_remaining", "charge_state",
                       "voltages_ext", "mode", "fault_bitmask"],
    "SYS_STATUS": ["onboard_control_sensors_present", "onboard_control_sensors_enabled",
                   "onboard_control_sensors_health", "load", "voltage_battery", "current_battery", "battery_remaining",
                   "drop_rate_comm", "errors_comm", "errors_count1", "errors_count2", "errors_count3", "errors_count4"]
}
