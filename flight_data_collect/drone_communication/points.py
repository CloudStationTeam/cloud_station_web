from pymavlink import mavutil

import requests
import urllib.parse

def get_lat_lon(address):
    
    url = 'https://nominatim.openstreetmap.org/search/' + urllib.parse.quote(address) +'?format=json'
    print("addr "+urllib.parse.quote(address))

    response = requests.get(url).json()
    if (len(response)<1):
        print("No response.")
        return -1, -1
    lat = response[0]["lat"]
    lon = response[0]["lon"]
    return lat, lon

def get_lat_lon_test(address):
    # Get latitude and longitude
    address1 = 'Shivaji Nagar, Bangalore, KA 560001'
    address2 = '1 Shields Avenue, Davis, CA 95616'
    #address3 = '401 E. Peltason Drive, Suite 3200, Irvine, CA 92617'
    address3 = '401 E. Peltason Drive, Irvine, CA 92617'
    
    lat, lon = get_lat_lon(address2)
    print(lat, lon)

def get_alt(lat, lon): #TODO. Google API maybe better, but it costs money.
    # Get altitude
    # Note that they have limited rates.
    OPENTOPO_API_URL = "https://api.opentopodata.org/v1/test-dataset?locations={},{}"
       
    response = requests.get(OPENTOPO_API_URL.format(lat, lon))
    if response.status_code != 200:
        raise Exception("Error: Non-200 response from Open Topo Data API")
    
    data = response.json()
    if "results" not in data or len(data["results"]) == 0:
        raise Exception("Error: No results in Open Topo Data API response")
    
    alt = data["results"][0]["elevation"]
    
    return alt

def get_lat_lon_alt(address):
    lat, lon = get_lat_lon(address)
    alt = get_alt(lat, lon)
    return lat, lon, alt #returns a tuple 

'''
ex.
lat, lon, alt = get_lat_lon_alt("1600 Amphitheatre Parkway, Mountain View, CA")
print(f"Latitude: {lat}, Longitude: {lon}, Altitude: {alt}")
'''

def send_waypoint_example(connection, lat, lon, alt, seq):
    """
    Send a waypoint to the drone.

    #Ref. https://ardupilot.org/copter/docs/common-mavlink-mission-command-messages-mav_cmd.html
    For the altitude obtained from the Open Topo Data API,
    you should use MAV_FRAME_GLOBAL for your MAVLink commands.
    This frame uses the WGS84 coordinate system where altitude is relative to mean sea level.
    This is appropriate because the altitude obtained from the Open Topo Data API is also relative to mean sea level
    """
    connection.mav.mission_item_send(
        connection.target_system,
        connection.target_component,
        seq, # Sequence number of the waypoint
        mavutil.mavlink.MAV_FRAME_GLOBAL, # The frame of reference
        mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, # The command, in this case, to navigate to a waypoint
        0, # Current waypoint
        0, # Autocontinue to next waypoint
        0, 0, 0, 0, # Parameters 1-4 not used
        lat, lon, alt) # Parameters 5-7 are latitude, longitude, altitude

def test(the_connection):
    lat, lon, alt = get_lat_lon_alt("1600 Pennsylvania Ave, Washington, DC")
    send_waypoint(the_connection, lat, lon, alt, seq=0)

