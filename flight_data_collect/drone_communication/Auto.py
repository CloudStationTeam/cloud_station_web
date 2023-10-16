
import requests
from django.conf import settings
from django.http import JsonResponse



def list_settings_keys():
    keys = [key for key in dir(settings) if not key.startswith("_")]
    print(keys)




def autocomplete_view(query):
    list_settings_keys()
    print("wtf")
    response = requests.get(f'https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&key={settings.GOOGLE_MAP_API_KEY}')
    return JsonResponse(response.json())

def test_autocomplete_view():
    print("test_autocomplete_view")
    query =  "1 Shields Ave., Davis, CA 95616"
    places = autocomplete_view(query)
    print(places, "???")

