# flight_data_collect/models.py
from django.db import models
from django.contrib.auth.models import User 
import uuid
import json

class Vehicle(models.Model):
    droneid = models.IntegerField(primary_key=True)
    
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
    # owner = models.ManyToManyField('User', help_text='Users who have access to the vehicle data')
    is_connected = models.BooleanField(default=False)


    

    mode = models.IntegerField(default=0)
    lat = models.FloatField(default=0)
    lon = models.FloatField(default=0)
    alt = models.FloatField(default=0)
    airspeed = models.FloatField(default=0)
    groundspeed = models.FloatField(default=0)
    horizontal_speed = models.FloatField(default=0)
    heading = models.FloatField(default=0)
    
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
    