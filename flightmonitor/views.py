from django.shortcuts import render, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings

from contextlib import redirect_stderr
from django.shortcuts import render, redirect

from django.http import HttpResponse


from django.contrib.auth.models import auth

from django.contrib.auth import authenticate,login,logout
from . forms import CreateUserForm


@never_cache
@ensure_csrf_cookie
def default_layout(request):
    
    return render(request, 'default_layout.html', {"MAPBOX_KEY":settings.MAPBOX_PUBLIC_KEY})



def register(request):
    form = CreateUserForm()
    if request.method == "POST":
        form=CreateUserForm(request.POST)    
        if form.is_valid():
            form.save()
            #return redirect('my_login')
            #return render(request, 'default_layout.html', {"MAPBOX_KEY":settings.MAPBOX_PUBLIC_KEY})
            return redirect('/accounts/login')
    context = {'registerform':form}
    return render(request, 'register.html', context=context)



def m_logout(request):
    auth.logout(request)
    #return redirect('')
    return render(request, 'default_layout.html', {"MAPBOX_KEY":settings.MAPBOX_PUBLIC_KEY})

