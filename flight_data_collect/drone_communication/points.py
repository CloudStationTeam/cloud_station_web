import requests

def get_lat_lon_alt(address):
    # Note that they have limited rates.
    GEOCODE_API_URL = "https://geocode.maps.co/search?q={}"
    OPENTOPO_API_URL = "https://api.opentopodata.org/v1/test-dataset?locations={},{}"
    
    # Get latitude and longitude
    response = requests.get(GEOCODE_API_URL.format(address))
    if response.status_code != 200:
        raise Exception("Error: Non-200 response from Geocoding API")
    
    data = response.json()
    if "features" not in data or len(data["features"]) == 0:
        raise Exception("Error: No features in Geocoding API response")
    
    lat = data["features"][0]["geometry"]["coordinates"][1]
    lon = data["features"][0]["geometry"]["coordinates"][0]
    
    # Get altitude
    response = requests.get(OPENTOPO_API_URL.format(lat, lon))
    if response.status_code != 200:
        raise Exception("Error: Non-200 response from Open Topo Data API")
    
    data = response.json()
    if "results" not in data or len(data["results"]) == 0:
        raise Exception("Error: No results in Open Topo Data API response")
    
    alt = data["results"][0]["elevation"]
    
    return lat, lon, alt

'''
ex.
lat, lon, alt = get_lat_lon_alt("1600 Amphitheatre Parkway, Mountain View, CA")
print(f"Latitude: {lat}, Longitude: {lon}, Altitude: {alt}")
'''

