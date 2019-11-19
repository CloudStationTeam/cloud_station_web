from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from flight_data_collect.drone_communication.mavlink_utils import connect_mavlink, get_mavlink_messages_periodically
import datetime

TIME_INTERVAL = 4  # second(s)
REPEAT_UNTIL = 20  

def connect_vehicle(request, connect_address):
    heartbeat_msg = connect_mavlink(connect_address)
    if heartbeat_msg:
        msg = " Successully connected to " + connect_address + "\n" + heartbeat_msg
        get_mavlink_messages_periodically(connect_address, repeat=TIME_INTERVAL, \
                    repeat_until=datetime.datetime.now()+datetime.timedelta(seconds=REPEAT_UNTIL))
    else:
        msg = "Error: Failed to connect to " + connect_address
    return HttpResponse(msg, content_type="text/plain")

def disconnect_vehicle(request):
    return HttpResponse('disconnected', content_type="text/plain")
    