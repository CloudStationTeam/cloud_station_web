from django.shortcuts import render
import json
from django.http import HttpResponse, HttpResponseNotFound
from flight_data_collect.models import Vehicle
from flight_data_collect.drone_communication.mavlink_utils import check_vehicle_heartbeat, get_mavlink_messages
from flight_data_collect.drone_communication.mavlink_control import change_mode, set_waypoints, set_arm, fly_to_point
import datetime


def connect_vehicle(request, connect_address):
    is_successful = check_vehicle_heartbeat(connect_address)
    if is_successful:
        v = Vehicle(droneid=connect_address, is_connected=True)
        v.save()
        get_mavlink_messages(connect_address)
        msg = f'disconnected from {connect_address}'
    else:
        msg = "Error: Failed to connect to " + connect_address + "(timeout 6s)"
    return HttpResponse(msg, content_type="text/plain")


def disconnect_vehicle(request, connect_address):
    try:
        vehicle = Vehicle.objects.get(droneid=connect_address)
        vehicle.is_connected = False
        vehicle.save()
        response = {'msg': 'disconnected successfully'}
    except Vehicle.DoesNotExist:
        response = {'ERROR': f'Vehicle {connect_address} does not exist'}
    return HttpResponse(json.dumps(response), content_type="text/plain")


def set_mode(request, droneid, mode):
    msg = change_mode(droneid, mode)
    return HttpResponse(json.dumps(msg), content_type="text/plain")


def fly_to(request, droneid, lat, lon, alt):
    msg = fly_to_point(int(droneid), float(lat), float(lon), float(alt))
    return HttpResponse(json.dumps(msg), content_type="text/plain")


def set_waypoint(request, droneid, lat, lon, alt):
    '''this function should be changed to add multiple waypoints. currently it only adds one'''
    msg = set_waypoints(int(droneid), [(float(lat), float(lon), float(alt))])
    return HttpResponse(json.dumps(msg), content_type="text/plain")


def arm(request, droneid):
    msg = set_arm(int(droneid))
    return HttpResponse(json.dumps(msg), content_type="text/plain")


def disarm(request, droneid):
    msg = set_arm(int(droneid), is_disarm=True)
    return HttpResponse(json.dumps(msg), content_type="text/plain")


def update_fields(request):
    if request.method == "GET":
        return HttpResponse("hello")
    msg = str(request.POST)
    return HttpResponse(json.dumps(msg), content_type="text/plain")
