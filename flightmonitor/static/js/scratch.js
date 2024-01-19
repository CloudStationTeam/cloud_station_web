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
