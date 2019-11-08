from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from flight_data_collect.drone_communication.mavlink_utils import connect_mavlink, get_mavlink_messages_periodically

TIME_INTERVAL = 2.5  # second(s)
ANGLE_INTERVAL = 4  # degree(s)

def connect_vehicle(request, connect_address):
    connection_flag = connect_mavlink(connect_address)
    if connection_flag:
        response = 'Successfully connected to ' 
        get_mavlink_messages_periodically(repeat=TIME_INTERVAL, repeat_until=None)
    else:
        response = "Error: Falied to "
    return HttpResponse(response+connect_address, content_type="text/plain")
    

def disconnect_vehicle(request):
    return HttpResponse('disconnected', content_type="text/plain")
    