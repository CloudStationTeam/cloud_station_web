var browserSocket = new WebSocket(
  'ws://' + window.location.host +
  '/ws/flightmonitor/');

console.log("Test console log: Javascript in browser successfully connected to websocket server.\n");

HEARTBEAT = "HEARTBEAT"
SYS_STATUS = 'SYS_STATUS'
SYSTEM_TIME = 'SYSTEM_TIME'
LOCAL_POSITION_NED = 'LOCAL_POSITION_NED'
VFR_HUD = 'VFR_HUD'
POWER_STATUS = 'POWER_STATUS'
GLOBAL_POSITION_INT = 'GLOBAL_POSITION_INT'
MISSION_CURRENT = 'MISSION_CURRENT'

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
  // * dump message to console
   console.log("[LOG] Websocket messaage received: e.data ", e.data) 
  // e.data is the payload of the message. e means event.

  // * Dump message to broswer
  var toggleSwitch = document.getElementById("toggleSwitch");
  if (toggleSwitch.checked) {
    // dump message to browswer
    debugmsg = e.data;
    var textarea = document.getElementById("dynamicTextdebugmsg");
    textarea.value += "\n";
    textarea.value += debugmsg;
 }

  // * Parse mavlink message and update browser
  var parsedData = JSON.parse(e.data); // this is the json object now.
  msg_to_handle = parsedData.msg;
  droneport=parsedData.port;

  console.log('[PARSE LOG]');
  console.log('msg_to_handle = ');
  console.log(msg_to_handle);
  console.log('droneport = ');
  console.log(droneport);

  handle_mavlink_message(msg_to_handle)

  // console.log('[LOG]');
  // console.log('parsedData = ');
  // console.log(parsedData);

  // test_parsedData = {"msg": {"mavpackettype": "GLOBAL_POSITION_INT", "time_boot_ms": 8020057, "lat": 336458610, "lon": -1178427499, "alt": 25070, "relative_alt": -23, "vx": -1, "vy": 1, "vz": 0, "hdg": 135}, "port": "14558"};

  // console.log('test_parsedData = ');
  // console.log(test_parsedData);

  // console.log('test_parsedData.msg = ');
  // console.log(test_parsedData.msg);

  // var test_parsedmessage = test_parsedData['msg'];
  // console.log('test_parsedmessage=')
  // console.log(test_parsedmessage)
  // var parsedmessage = parsedData['msg'];
  // console.log('parsedData=')
  // console.log(parsedData)


  // xxx handle_mavlink_message(parsedData)

  //xxx Parse alternative message structure that contains both mavlink message and port: and handle incoming messages
  //xxx  const m_data = JSON.parse(e.data);
   //xxx const msgAsJSON = JSON.stringify(m_data.msg);
    //xxxconsole.log(' msgAsJSON  = '   + msgAsJSON);
   //xxx const port = m_data.port;
  //xxx  console.log('port =: '+ port);





    // Assuming 'messageType' is a property in your msg object
    // const messageType = parsedData.msg.messageType;
    //const messageType = m_data.msgAsJSON.messageType;
    // const messageType = m_data.msgAsJSON.mavpackettype;
    
//    console.log(`Received message on port ${port}. Message Type: ${messageType}`);

};

browserSocket.onclose = function (e) {
  console.log("[LOG] Websocket closed.\n")
};

// Sends a message to the server (and prints it to the console)
function doSend(message) {
  console.log("Sending: " + message);
  browserSocket.send(message);
}

function handle_mavlink_message(parsedData) {
  // Access the values in the object
  var mavpackettype = parsedData.mavpackettype;
  if (mavpackettype == "GLOBAL_POSITION_INT") {
    // parse the GPS message:
    var lat = parsedData.lat;
    var lon = parsedData.lon;
    var alt = parsedData.alt;
    var time_boot_ms = parsedData.time_boot_ms;
    var relative_alt = parsedData.relative_alt;
    var vx = parsedData.vx;
    var vy = parsedData.vy;
    var vz = parsedData.vz;
    var hdg = parsedData.hdg;

    // Display the values in html page:

    const dynamicTextElementlat = document.getElementById('lat');
    dynamicTextElementlat.textContent = lat;
    const dynamicTextElementlon = document.getElementById('lon');
    dynamicTextElementlon.textContent = lon;
    const dynamicTextElementalt = document.getElementById('alt');
    dynamicTextElementalt.textContent = alt;
    const dynamicTextElementtime_boot_ms = document.getElementById('time_boot_ms');
    dynamicTextElementtime_boot_ms.textContent = time_boot_ms;

    const dynamicTextElementrelative_alt = document.getElementById('relative_alt');
    dynamicTextElementrelative_alt.textContent = relative_alt;
    const dynamicTextElementvx = document.getElementById('vx');
    dynamicTextElementvx.textContent = vx;
    const dynamicTextElementvy = document.getElementById('vy');
    dynamicTextElementvy.textContent = vy;
    const dynamicTextElementvz = document.getElementById('vz');
    dynamicTextElementvz.textContent = vz;
    const dynamicTextElementhdg = document.getElementById('hdg');
    dynamicTextElementhdg.textContent = hdg;






  };
  if (mavpackettype == "VFR_HUD") {
    // Parse the VFR_HUD message:
    var airspeed = parsedData.airspeed;
    var groundspeed = parsedData.groundspeed;
    var heading = parsedData.heading;
    var throttle = parsedData.throttle;
    var climb = parsedData.climb;
    // Update the display:
    const dynamicTextElementairspeed = document.getElementById('airspeed');
    dynamicTextElementairspeed.textContent = airspeed;
    const dynamicTextElementgroundspeed = document.getElementById('groundspeed');
    dynamicTextElementgroundspeed.textContent = groundspeed;
    const dynamicTextElementheading = document.getElementById('heading');
    dynamicTextElementheading.textContent = heading;
    const dynamicTextElementthrottle = document.getElementById('throttle');
    dynamicTextElementthrottle.textContent = throttle;
    const dynamicTextElementclimb = document.getElementById('climb');
    dynamicTextElementclimb.textContent = climb;
  };
  if (mavpackettype == "HEARTBEAT") {
    // Parse the HEARTBEAT message:
    // var MAV_TYPE = parsedData.MAV_TYPE; // type in message
    var type = parsedData.type;
    var base_mode = parsedData.base_mode;
    var custom_mode = parsedData.custom_mode;
    // Update the display:
    const dynamicTextElementtype = document.getElementById('type');
    dynamicTextElementtype.textContent = type;

    const dynamicTextElementbase_mode = document.getElementById('base_mode');
    dynamicTextElementbase_mode.textContent = base_mode;

    const dynamicTextElementcustom_mode = document.getElementById('custom_mode');
    dynamicTextElementcustom_mode.textContent = custom_mode;



  };
  if (mavpackettype == "SYS_STATUS") {
    // Parse the SYS_STATUS message:
    var voltage_battery = parsedData.voltage_battery;
    var current_battery = parsedData.current_battery;
    var battery_remaining = parsedData.battery_remaining;
    // Update the display:
    const dynamicTextElementvoltage_battery = document.getElementById('voltage_battery');
    dynamicTextElementvoltage_battery.textContent = voltage_battery;
    const dynamicTextElementcurrent_battery = document.getElementById('current_battery');
    dynamicTextElementcurrent_battery.textContent = current_battery;
    const dynamicTextElementbattery_remaining = document.getElementById('battery_remaining');
    dynamicTextElementbattery_remaining.textContent = battery_remaining;
  };
  if (mavpackettype == "SYSTEM_TIME") {
    // Parse the SYSTEM_TIME message:
    var time_unix_usec = parsedData.time_unix_usec;
    // Update the display:
    const dynamicTextElementtime_unix_usec = document.getElementById('time_unix_usec');
    dynamicTextElementtime_unix_usec.textContent = time_unix_usec;
  };
  if (mavpackettype == "DRONECOMM") {
    // parse the GPS message:
    var drone_remote_IP = parsedData.drone_remote_IP;
    var drone_local_IP = parsedData.drone_local_IP;
    var drone_id_to_connect_to = parsedData.drone_id_to_connect_to; // need to flag webdrone ojbect as connected...

    const dynamicTextElementlat = document.getElementById('drone_local_IP');
    dynamicTextElementlat.textContent = drone_local_IP;
    const dynamicTextElementlon = document.getElementById('drone_remote_IP');
    dynamicTextElementlon.textContent = drone_remote_IP;
    
  
    // Use Array.find() to get the object based on the property
    let m_WebDrone_object = window.m_Array_of_WebDrone_objects.find(obj => obj.droneid === drone_id_to_connect_to);
    m_WebDrone_object.is_connected = true;
    console.log('flaggins connecte this object: m_WebDrone_object: ');
    console.log(m_WebDrone_object);


  }
}

function toggleFunction() {
  var toggleSwitch = document.getElementById("toggleSwitch");
  var textarea = document.getElementById("dynamicTextdebugmsg");
  //textarea.style.visibility = toggleSwitch.checked ? "visible" : "hidden";

  if (toggleSwitch.checked) {
      // Run your JavaScript function when the switch is checked
      console.log('toggle switch turned on');
      textarea.value = "";
      // make text area visible
    } else {
    console.log('toggle switch turned off');
    // make text area invisible
    // clear text field
  }
} 
