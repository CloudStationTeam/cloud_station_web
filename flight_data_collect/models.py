# flight_data_collect/models.py
from django.db import models
from django.contrib.auth.models import User 
import uuid
import json

class Vehicle(models.Model):
    droneid = models.IntegerField(primary_key=True) # this is the port, typically 14550 and up; Want to change name to drone_port later
    drone_local_IP = models.GenericIPAddressField(protocol='both', unpack_ipv4=True,default='127.0.0.1') # local IP address of Django server machine
    drone_remote_IP = models.GenericIPAddressField(protocol='both', unpack_ipv4=True,default='127.0.0.1') # local IP address of Django server machine
    #drone_local_IP = models.GenericIPAddressField(null=True) # local IP address of Django server machine
    #drone_local_IP = models.GenericIPAddressField(default='',null=True) # local IP address of Django server machine
    #drone_remote_IP = models.GenericIPAddressField(default='',null=True) # remote IP address that is sending the mavlink packets to Django
    # An IPv4 or IPv6 address, in string format (e.g. 192.0.2.30)
    
    VEHICLE_TYPES = (  # will need to include all vehicles
        ('c', 'Copter'),
        ('h', 'Helicopter'),
        ('p', 'Plane'),
        ('b', 'Boat'),
        ('c', 'Car'),
        ('o', 'Other')
    )
    
    vehicle_type = models.CharField(
        max_length=1,
        choices=VEHICLE_TYPES,
        blank=True,
        default='o',
        help_text='Vehicle type',
    )
    last_seen = models.DateTimeField(auto_now=True)    
    is_connected = models.BooleanField(default=False)
    
# fields direct from mavlink messages:
    # HEARTBEAT:

    # MAV_TYPE 	Vehicle or component type. 
    MAV_TYPE = models.IntegerField(default=0)

    # base_mode	uint8_t	MAV_MODE_FLAG	System mode bitmap.
    base_mode = models.IntegerField(default=0)
    # base_mode:
    # Value	Field Name	Description
    # 128	MAV_MODE_FLAG_SAFETY_ARMED

    # custom_mode	uint32_t		A bitfield for use for autopilot-specific flags
    custom_mode = models.IntegerField(default=0)
    # print(f"Flight Mode: {msg.custom_mode}")

    # SYS_STATUS:

    # voltage_battery	uint16_t	mV		Battery voltage, UINT16_MAX: Voltage not sent by autopilot
    voltage_battery = models.IntegerField(default=0)

    # current_battery	int16_t	cA		Battery current, -1: Current not sent by autopilot
    current_battery = models.IntegerField(default=0)

    # battery_remaining	int8_t	%		Battery energy remaining, -1: Battery remaining energy not sent by autopilot
    battery_remaining = models.IntegerField(default=0)

    # SYSTEM_TIME:

    #time_unix_usec	uint64_t	us	Timestamp (UNIX epoch time).
    time_unix_usec = models.BigIntegerField(default=0)

    #time_boot_ms	uint32_t	ms	Timestamp (time since system boot)
    # time_boot_ms = models.IntegerField(default=0)
    # Redundant with GPS 

    # GLOBAL_POSITION_INT
    #time_boot_ms	# uint32_t	ms	Timestamp (time since system boot).
    time_boot_ms = models.IntegerField(default=0)

    #lat	# int32_t	degE7	Latitude, expressed
    lat = models.IntegerField(default=0)


    #lon	# int32_t	degE7	Longitude, expressed
    lon = models.IntegerField(default=0)


    #alt	# int32_t	mm	Altitude (MSL). Note that virtually all GPS modules provide both WGS84 and MSL.
    alt = models.IntegerField(default=0)

    #relative_alt #	int32_t	mm	Altitude above ground
    relative_alt = models.IntegerField(default=0)

    #vx	# int16_t	cm/s	Ground X Speed (Latitude, positive north)
    vx = models.IntegerField(default=0)

    #vy	# int16_t	cm/s	Ground Y Speed (Longitude, positive east)
    vy = models.IntegerField(default=0)

    #vz	# int16_t	cm/s	Ground Z Speed (Altitude, positive down)
    vz = models.IntegerField(default=0)

    #hdg	# uint16_t	cdeg	Vehicle heading (yaw angle), 0.0..359.99 degrees. If unknown, set to: UINT16_MAX
    hdg = models.IntegerField(default=0)

    # VFR_HUD:

    # airspeed	float	m/s	Vehicle speed in form appropriate for vehicle type. For standard aircraft this is typically calibrated airspeed (CAS) or indicated airspeed (IAS) - either of which can be used by a pilot to estimate stall speed.
    airspeed = models.FloatField(default=0)

    # groundspeed	float	m/s	Current ground speed.
    groundspeed = models.FloatField(default=0)

    # heading	int16_t	deg	Current heading in compass units (0-360, 0=north).
    heading = models.IntegerField(default=0)

    # throttle	uint16_t	%	Current throttle setting (0 to 100).
    throttle = models.IntegerField(default=0)

    # alt	float	m	Current altitude (MSL).
    # alt = models.IntegerField(default=0)
    # Redundant with GPS

    # climb	float	m/s	Current climb rate.
    climb = models.FloatField(default=0)




    def __str__(self):
        """String for representing the Model object."""
        data = {'droneid': self.droneid,
                'is_connected': self.is_connected,
                'vehicle_type': self.vehicle_type,
                'last_seen': str(self.last_seen)
        }
        return json.dumps(data)

class Location_log(models.Model):
    #vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    latitude = models.DecimalField(decimal_places=6, max_digits=9)
    longitude = models.DecimalField(decimal_places=6, max_digits=9)
    altitude = models.DecimalField(decimal_places=4, max_digits=9)
    heading = models.DecimalField(decimal_places=4, max_digits=9)
    droneid = models.IntegerField()
    
    def __str__(self):
        data = {
            "mavpackettype": "GLOBAL_POSITION_INT",
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "lat": float(self.latitude),
            "lon": float(self.longitude),
            "alt": float(self.altitude),
            "heading": float(self.heading),
            "droneid": int(self.droneid)
        }
        return json.dumps(data)

class Telemetry_log(models.Model):
    #vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(null=True)
    roll = models.DecimalField(decimal_places=2, max_digits=5)
    pitch = models.DecimalField(decimal_places=2, max_digits=5)
    yaw = models.DecimalField(decimal_places=2, max_digits=5)
    droneid = models.IntegerField()
    # rollspeed = models.DecimalField(decimal_places=2, max_digits=5)
    # pitchspeed = models.DecimalField(decimal_places=2, max_digits=5)
    # yawspeed = models.DecimalField(decimal_places=2, max_digits=5)
    
    def __str__(self):
        data = {
            "mavpackettype": "ATTITUDE",
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "roll": float(self.roll),
            "pitch": float(self.pitch),
            "yaw": float(self.yaw),
            "droneid": int(self.droneid)
        }
        return json.dumps(data)
    