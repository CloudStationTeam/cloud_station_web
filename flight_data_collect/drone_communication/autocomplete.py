import requests
from django.conf import settings
from django.http import JsonResponse

def autocomplete_view(query, lat=None, lon=None):
    params = {
        'input': query,
        'key': settings.GOOGLE_MAP_API_KEY,
    }
    if location:
        params['location'] = f'{lat},{lon}' # This biases the autocomplete predictions to the specified location

    response = requests.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', params=params)

    #response = requests.get(f'https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&key={settings.GOOGLE_MAP_API_KEY}')
    print(response.text if response.status_code == 200 else None) # Not all eq, Not pass 
    #return JsonResponse(response.json()) # TypeError: Object of type 'JsonResponse' is not JSON serializable
    return response.json()

def test_autocomplete_view():
    print("test_autocomplete_view")
    query =  "1 Shields Ave., Davis, CA 95616"
    places = autocomplete_view(query)
    print(places, "???")

