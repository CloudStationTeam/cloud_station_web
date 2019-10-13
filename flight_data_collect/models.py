# flight_data_collect/models.py
from django.db import models
from django.contrib.auth.models import User 
import uuid

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
    latitude = models.IntegerField()
    longitude = models.IntegerField()
    altitude = models.IntegerField()
    heading = models.IntegerField()
    
    def __str__(self):
        return f'location_log <{self.timestamp}>'

class Telemetry_log(models.Model):
    #vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(null=True)
    roll = models.DecimalField(decimal_places=2, max_digits=5)
    pitch = models.DecimalField(decimal_places=2, max_digits=5)
    yaw = models.DecimalField(decimal_places=2, max_digits=5)
    # rollspeed = models.DecimalField(decimal_places=2, max_digits=5)
    # pitchspeed = models.DecimalField(decimal_places=2, max_digits=5)
    # yawspeed = models.DecimalField(decimal_places=2, max_digits=5)
    
    def __str__(self):
        return f'<{self.timestamp}>\tr:{self.roll}\tp:{self.pitch}\ty:{self.yaw}'
    