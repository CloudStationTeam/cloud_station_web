# flight_data_collect/models.py
from django.db import models
from django.contrib.auth.models import User 
import uuid
import json

class Vehicle(models.Model):
    vid = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for the Vehicle')
    
    VEHICLE_TYPES = (  # will need to include all vehicles
        ('c', 'Copter'),
        ('h', 'Helicopter'),
        ('p', 'Plane'),
        ('b', 'Boat'),
        ('c', 'Car'),
        ('o', 'Other')
    )
    
    type = models.CharField(
        max_length=1,
        choices=VEHICLE_TYPES,
        blank=True,
        default='o',
        help_text='Vehicle type',
    )
    
    firmware = models.CharField(max_length=25,blank=True)
    #owner = models.ManyToManyField('User', help_text='Users who have access to the vehicle data')
    
    def __str__(self):
        """String for representing the Model object."""
        return self.vid

class Location_log(models.Model):
    #vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    latitude = models.DecimalField(decimal_places=6, max_digits=9)
    longitude = models.DecimalField(decimal_places=6, max_digits=9)
    altitude = models.DecimalField(decimal_places=4, max_digits=9)
    heading = models.DecimalField(decimal_places=4, max_digits=9)
    droneid = models.IntegerField()
    
    def __str__(self):
        location_dict = {
            "type": "location",
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "latitude": float(self.latitude),
            "longitude": float(self.longitude),
            "altitude": float(self.altitude),
            "heading": float(self.heading),
            "droneid": int(self.droneid)
        }
        return json.dumps(location_dict)

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
        altitude_dict = {
            "type": "altitude",
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "roll": float(self.roll),
            "pitch": float(self.pitch),
            "yaw": float(self.yaw),
            "droneid": int(self.droneid)
        }
        return json.dumps(altitude_dict)
    