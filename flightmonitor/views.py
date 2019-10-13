from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
#from pymavlink import mavutils

def default_layout(request):
    #vehicle = mavutil.mavlink_connection('com18')
    #while True:
    #    msg = vehicle.recv_match(type='ATTITUDE', blocking=True)
    #    if msg and msg.get_type() != 'BAD_DATA':
    #        print(f'time since boot: {msg.time_boot_ms}\nroll: {msg.roll}\tpitch: {msg.pitch}\tyaw: {msg.yaw}')
    #        print(f'rollspeed: {msg.rollspeed}\tpitchspeed: {msg.pitchspeed}\tyawspeed: {msg.yawspeed}\n\n')
    return render(request, 'default_layout.html', context={})

def map(request):
    return render(request, 'map.html', context={})
