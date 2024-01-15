var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');

    console.log("Test console log: Javascript in browser successfully connected to websocket server.\n");

    HEARTBEAT = "HEARTBEAT"
SYS_STATUS='SYS_STATUS'
SYSTEM_TIME='SYSTEM_TIME'
LOCAL_POSITION_NED='LOCAL_POSITION_NED'
VFR_HUD='VFR_HUD'
POWER_STATUS = 'POWER_STATUS'
GLOBAL_POSITION_INT = 'GLOBAL_POSITION_INT'
MISSION_CURRENT='MISSION_CURRENT'

    USEFUL_MESSAGES_V4_0 = [
      HEARTBEAT,
      SYS_STATUS,
      SYSTEM_TIME,
      LOCAL_POSITION_NED,
      GLOBAL_POSITION_INT,
      MISSION_CURRENT,
      VFR_HUD
     ]
     
browserSocket.onmessage = function (e) {
  console.log("[LOG] Websocket messaage received: ",e.data )
  //console.log("e.data:")
  //console.log(e.data)
//    if (msg["mavpackettype"] == "GLOBAL_POSITION_INT") {//create html element for the new marker [only initialize if the first data has location]
//        console.log("[LOG] message type is GPS.")  }
//  Parse
//  Pseudo code:
//  1. Parse out the mavlinkg type (GPS INT)
//  2. Parse out the lat lon
//  3. Change text on webpage dynamically.
  // JSON string representing a dictionary
//  var jsonString = '{"name": "John", "age": 30, "city": "New York"}';

  // Parse JSON string into a JavaScript object
//  var parsedData = JSON.parse(jsonString);
  debugmsg=e.data;
  const dynamicTextElementdebugmsg = document.getElementById('dynamicTextdebugmsg');
  dynamicTextElementdebugmsg.textContent = debugmsg;


  var parsedData = JSON.parse(e.data);


  // Access the values in the object
  var mavpackettype = parsedData.mavpackettype;
//  console.log('[LOG][websocketcode.js] mavpackettype = ' + mavpackettype);
  // if mavpackettype == "GLOBAL_POSITION_INT":
  if (mavpackettype == "GLOBAL_POSITION_INT") {
    // parse the GPS message:
    var lat = parsedData.lat;
    var lon = parsedData.lon;
    var alt = parsedData.alt;
    var time_usec = parsedData.time_usec;
    // Log the values:
  //  console.log("mavpackettype: " + mavpackettype);
   // console.log("lat: " + lat);
   // console.log("lon: " + lon);
   // console.log("alt: " + alt);
   // console.log("time_usec: " + time_usec);
    // Display the values in html page:
    // Get the element with the id "dynamicText"
    const dynamicTextElementlat = document.getElementById('dynamicTextlat');
    dynamicTextElementlat.textContent = lat;
    const dynamicTextElementlon = document.getElementById('dynamicTextlon');
    dynamicTextElementlon.textContent = lon;
    const dynamicTextElementalt = document.getElementById('dynamicTextalt');
    dynamicTextElementalt.textContent = alt;
    const dynamicTextElementtime_usec = document.getElementById('dynamicTexttime_usec');
    dynamicTextElementtime_usec.textContent = time_usec;
};


};

browserSocket.onclose = function (e) {
    console.log("[LOG] Websocket closed.\n")
};

// Sends a message to the server (and prints it to the console)
function doSend(message) {
    console.log("Sending: " + message);
    browserSocket.send(message);
}

