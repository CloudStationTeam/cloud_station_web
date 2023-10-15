
from django.conf import settings
import requests

def autocomplete_view(query):
    response = requests.get(f'https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&key={settings.MAPBOX_PUBLIC_KEY}')
    return JsonResponse(response.json())

def test_autocomplete_view():
    print("test_autocomplete_view")
    query =  "1 Shields Ave., Davis, CA 95616"
    places = autocomplete_view(query)
    print(places, "???")

