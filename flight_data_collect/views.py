from django.shortcuts import render
import json
from django.http import HttpResponse, HttpResponseNotFound
from flight_data_collect.drone_communication.mavlink_utils import connect_mavlink, get_mavlink_messages_periodically
from flight_data_collect.drone_communication.mavlink_control import change_mode
import datetime

TIME_INTERVAL = 1  # second(s)
REPEAT_UNTIL = 60  

def connect_vehicle(request, connect_address):
    is_successful = connect_mavlink(connect_address)
    if is_successful:
        msg = "Successully connected to " + connect_address + "\n" + "> Heartbeat Received!"
        get_mavlink_messages_periodically(connect_address, repeat=TIME_INTERVAL, \
                    repeat_until=datetime.datetime.now()+datetime.timedelta(seconds=REPEAT_UNTIL))
    else:
        msg = "Error: Failed to connect to " + connect_address + "(timeout)"
    return HttpResponse(msg, content_type="text/plain")

def disconnect_vehicle(request):
    return HttpResponse('disconnected', content_type="text/plain")

def set_mode(request, droneid, mode):
    msg = change_mode(droneid, mode)
    return HttpResponse(json.dumps(msg), content_type="text/plain")

    