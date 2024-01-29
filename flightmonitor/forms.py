from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from dataclasses import field

from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django import forms
from django.forms.widgets import PasswordInput, TextInput



# old v 2.0 signup, not used...
#class SignUpForm(UserCreationForm): ## extend the sign up form adding first name, last name, email
#   first_name = forms.CharField(max_length=30, required=False, help_text='Nice First name.')
#   last_name = forms.CharField(max_length=30, required=False, help_text='Nice Last name.')
#   email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')
#   vehicle = forms.CharField(max_length=12, help_text='Your vehicle ID!')
##   class Meta:
 #      model = User
 #     fields = ('username', 'first_name', 'last_name', 'email', 'vehicle', 'password1', 'password2', )



class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username','password1','password2']
