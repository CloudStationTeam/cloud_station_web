
from django.http import JsonResponse
from django.conf import settings 
import requests
import json


def get_gps_and_altitude_by_location(address):
    # Geocoding API endpoint
    geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={settings.GOOGLE_MAP_API_KEY}"
    
    response = requests.get(geocode_url)
    data = response.json()

    if data['status'] == 'OK':
        location = data['results'][0]['geometry']['location']
        lat, lon = location['lat'], location['lng']

        # Elevation API endpoint
        elevation_url = f"https://maps.googleapis.com/maps/api/elevation/json?locations={lat},{lon}&key={settings.GOOGLE_MAP_API_KEY}"
        elevation_response = requests.get(elevation_url)
        elevation_data = elevation_response.json() #ground elevation / the height of the ground above (or below) sea level

        if elevation_data['status'] == 'OK':
            alt = elevation_data['results'][0]['elevation']
            return lat, lon, alt

    return None, None, None



def test():
  location = "1 Shields Ave., Davis, CA 95616"
  lat, lon, alt = get_gps_and_altitude_by_location(location)
  print(f"Latitude: {lat}, Longitude: {lon}, Altitude: {alt} meters")


