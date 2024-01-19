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
