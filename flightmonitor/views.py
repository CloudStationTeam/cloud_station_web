from django.shortcuts import render, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from webgms.settings import MAPBOX_PUBLIC_KEY
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
#from pymavlink import mavutils

def default_layout(request):
    #vehicle = mavutil.mavlink_connection('com18')
    #while True:
    #    msg = vehicle.recv_match(type='ATTITUDE', blocking=True)
    #    if msg and msg.get_type() != 'BAD_DATA':
    #        print(f'time since boot: {msg.time_boot_ms}\nroll: {msg.roll}\tpitch: {msg.pitch}\tyaw: {msg.yaw}')
    #        print(f'rollspeed: {msg.rollspeed}\tpitchspeed: {msg.pitchspeed}\tyawspeed: {msg.yawspeed}\n\n')
    return render(request, 'default_layout.html', context={'mapbox_public_key': MAPBOX_PUBLIC_KEY})

def logged_in(request):
    #vehicle = mavutil.mavlink_connection('com18')
    #while True:
    #    msg = vehicle.recv_match(type='ATTITUDE', blocking=True)
    #    if msg and msg.get_type() != 'BAD_DATA':
    #        print(f'time since boot: {msg.time_boot_ms}\nroll: {msg.roll}\tpitch: {msg.pitch}\tyaw: {msg.yaw}')
    #        print(f'rollspeed: {msg.rollspeed}\tpitchspeed: {msg.pitchspeed}\tyawspeed: {msg.yawspeed}\n\n')
    return render(request, 'logged_in.html', context={'mapbox_public_key': MAPBOX_PUBLIC_KEY, 'name':request.user.username})

def map(request):
    return render(request, 'map.html', context={})



def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})
