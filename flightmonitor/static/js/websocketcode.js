var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');

    console.log("Test console log: Javascript in browser successfully connected to websocket server.\n");


browserSocket.onmessage = function (e) {
//    var data = JSON.parse(e.data);
//    var msg = JSON.parse(data['message']);
    console.log("[LOG] Websocket messaage received.")
//    console.log("msg:\n")
//    console.log(e.data)
    console.log("e.data:")
    console.log(e.data)
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

  var parsedData = JSON.parse(e.data);

  // Access the values in the object
  var mavpackettype = parsedData.mavpackettype;
  var lat = parsedData.lat;
  var lon = parsedData.lon;
  var alt = parsedData.alt;
  var time_usec = parsedData.time_usec;
  debugmsg=e.data;


  
  // Display the values
  console.log("mavpackettype: " + mavpackettype);
  console.log("lat: " + lat);
  console.log("lon: " + lon);
  console.log("alt: " + alt);
  console.log("time_usec: " + time_usec);
  

      // Get the element with the id "dynamicText"
    const dynamicTextElementlat = document.getElementById('dynamicTextlat');
    dynamicTextElementlat.textContent = lat;
    const dynamicTextElementlon = document.getElementById('dynamicTextlon');
    dynamicTextElementlon.textContent = lon;
    const dynamicTextElementalt = document.getElementById('dynamicTextalt');
    dynamicTextElementalt.textContent = alt;
    const dynamicTextElementtime_usec = document.getElementById('dynamicTexttime_usec');
    dynamicTextElementtime_usec.textContent = time_usec;
    const dynamicTextElementdebugmsg = document.getElementById('dynamicTextdebugmsg');
    dynamicTextElementdebugmsg.textContent = debugmsg;



};

browserSocket.onclose = function (e) {
    console.log("[LOG] Websocket closed.\n")
};

// Sends a message to the server (and prints it to the console)
function doSend(message) {
    console.log("Sending: " + message);
    browserSocket.send(message);
}

