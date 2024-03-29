// Assuming m_Array_of_WebDrone_objects is your array of WebDrone objects
let m_Array_of_WebDrone_objects = [
    { id: 1, name: 'Drone1', /* other properties */ },
    { id: 2, name: 'Drone2', /* other properties */ },
    { id: 3, name: 'Drone3', /* other properties */ },
    // ... other objects
];

// Property value to search for
let targetId = 2; // Change this to the value you want to search for

// Use Array.find() to get the object based on the property
let foundObject = m_Array_of_WebDrone_objects.find(obj => obj.id === targetId);

// Check if the object is found
if (foundObject) {
    console.log('Found Object:', foundObject);
} else {
    console.log('Object not found.');
}



// Replace "ws://your_websocket_server_address" with your WebSocket server address
const ws = new WebSocket("ws://your_websocket_server_address");

// Parse and handle incoming messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const port = data.port;
    
    // Assuming 'messageType' is a property in your msg object
    const messageType = data.msg.messageType;

    console.log(`Received message on port ${port}. Message Type: ${messageType}`);
};



// Assuming wsMessage is the WebSocket message string
const wsMessage = '{"msg":{"mavpackettype":"VFR_HUD","airspeed":0.023421762511134148,"groundspeed":0.0234217569231987,"heading":1,"throttle":0,"alt":25.06999969482422,"climb":-1.662250178924296e-05},"port":"14558"}';

// Parse the WebSocket message
const parsedMessage = JSON.parse(wsMessage);

// Accessing properties
const mavpackettype = parsedMessage.msg.mavpackettype;
const airspeed = parsedMessage.msg.airspeed;
const groundspeed = parsedMessage.msg.groundspeed;
const heading = parsedMessage.msg.heading;
const throttle = parsedMessage.msg.throttle;
const altitude = parsedMessage.msg.alt;
const climb = parsedMessage.msg.climb;
const port = parsedMessage.port;

// Example usage
console.log(`Mavpackettype: ${mavpackettype}`);
console.log(`Airspeed: ${airspeed}`);
console.log(`Groundspeed: ${groundspeed}`);
console.log(`Heading: ${heading}`);
console.log(`Throttle: ${throttle}`);
console.log(`Altitude: ${altitude}`);
console.log(`Climb: ${climb}`);
console.log(`Port: ${port}`);


// Assuming wsMessage is the WebSocket message string
const wsMessage = '{"msg":{"mavpackettype":"VFR_HUD","airspeed":0.023421762511134148,"groundspeed":0.0234217569231987,"heading":1,"throttle":0,"alt":25.06999969482422,"climb":-1.662250178924296e-05},"port":"14558"}';

// Parse the WebSocket message
const parsedMessage = JSON.parse(wsMessage);

// Extract the 'msg' part
const msgAsJSON = JSON.stringify(parsedMessage.msg);

// Example usage
console.log(msgAsJSON);











// chatgpt javascript find object in array from one of its properties
// Sample array of objects
const arrayOfObjects = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Doe' }
  ];
  
  // Function to find an object by property value
  function findObjectByProperty(array, propertyName, propertyValue) {
    return array.find(item => item[propertyName] === propertyValue);
  }
  
  // Example usage
  const foundObject = findObjectByProperty(arrayOfObjects, 'id', 2);
  
  if (foundObject) {
    console.log('Object found:', foundObject);
  } else {
    console.log('Object not found');
  }



  foundObject = array.find(item => item[propertyName] === propertyValue);


// chatgpt prompt: write an enum in javascript for mavlink heartbeat custom_mode to take the input and log to the console the actual mode

  const MAV_CUSTOM_MODE = {
    MANUAL: 100,
    ACRO: 120,
    ALT_HOLD: 200,
    AUTO: 220,
    GUIDED: 230,
    LOITER: 240,
    RTL: 250,
    CIRCLE: 110,
    POSITION: 80,
    MISSION: 90,
    LAND: 110,
  };
  
  function logActualMode(customModeInput) {
    const actualMode = Object.keys(MAV_CUSTOM_MODE).find(
      (key) => MAV_CUSTOM_MODE[key] === customModeInput
    );
  
    if (actualMode) {
      console.log("Actual Mode:", actualMode);
    } else {
      console.log("Unknown Mode");
    }
  }
  
  // Example usage:
  const inputCustomMode = 220; // Replace this with your desired custom mode
  logActualMode(inputCustomMode);
  

  // Add contextmenu (right-click) event listener to the map
map.on('contextmenu', (e) => {
  // Prevent the default context menu from appearing
  e.preventDefault();

  // Get the coordinates of the right-clicked point
  const { lng, lat } = e.lngLat;

  // Display an alert with the coordinates
  alert(`Right-clicked at Latitude: ${lat}, Longitude: ${lng}`);
});



  // Function to handle left click on the map
  function handleLeftClick(event) {
    // Get the coordinates of the click
    var coordinates = event.lngLat;
    const { lng, lat } = event.lngLat;
    alert(`Left-clicked at Latitude: ${lat}, Longitude: ${lng}`);
    // Log the coordinates to the console (you can replace this with your custom logic)
    console.log('Left click at:', coordinates);
    m_webdroneobject_to_fly.m_pin.remove(map);
    
  }

  // Add an event listener for the map's click event
  map.on('click', handleLeftClick);

  map.on('contextmenu', function (e) { //right click

    // Get the coordinates of the right-clicked point
    const { lng, lat } = e.lngLat;

    // Display an alert with the coordinates
    alert(`Right-clicked at Latitude: ${lat}, Longitude: ${lng}`);

    // make a popup window fly to
    m_webdroneobject_to_fly=get_webdrone_object_from_droneid(currSelectedDroneId);


    m_webdroneobject_to_fly.m_popup= new  mapboxgl.Popup({offset: 40});
    m_webdroneobject_to_fly.m_pin= new mapboxgl.Marker().setLngLat(e.lngLat).setPopup(m_webdroneobject_to_fly.m_popup);


    m_webdroneobject_to_fly.m_pin.addTo(map);
    let lon_to_fly_to = e.lngLat["lng"];
    let lat_to_fly_to = e.lngLat["lat"];



    if (tempPop.size > 0) { // not gonna happen in CS 4.0 so can ignore
        let longitude = e.lngLat["lng"];
        let latitude = e.lngLat["lat"];

        if (!tempPin.has(currSelectedDroneId)) {
            tempPin.set(currSelectedDroneId, new mapboxgl.Marker().setLngLat(e.lngLat).setPopup(tempPop.get(currSelectedDroneId)).addTo(map));
        } else
            tempPin.get(currSelectedDroneId).setLngLat(e.lngLat);
        tempPop.get(currSelectedDroneId).setHTML(currSelectedDroneId.toString() + '<br>Longitude: ' + longitude + '<br>Latitude: ' + latitude +
            '<br><button onclick="clearPin()">clear pin</button> <button onclick="flyTo(' + currSelectedDroneId + ',' + longitude + ',' + latitude + ',' + 0 + ')">Fly To</button>');
    }
})
