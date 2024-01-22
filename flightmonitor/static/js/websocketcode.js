
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
  // console.log("[LOG] Websocket messaage received: e.data ", e.data) // * dump message to console
  // e.data is the payload of the message. e means event.

  // * Dump message to broswer if user wants to see it
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
  droneport = parsedData.port;

  // console.log("[LOG] callling handle_mavlink_message(msg_to_handle) ", msg_to_handle) 
  // handle_mavlink_message(msg_to_handle)
  handle_mavlink_message(msg_to_handle, droneport)

};

browserSocket.onclose = function (e) {
  console.log("[LOG] Websocket closed.\n")
};

// Sends a message to the server (and prints it to the console)
function doSend(message) {
  console.log("Sending: " + message);
  browserSocket.send(message);
};

function handle_mavlink_message(parsedData, droneport) {
  // Access the values in the object
  var mavpackettype = parsedData.mavpackettype;
  // console.log("[LOG] handle_mavlink_message(parsedData) called with the following parseddata ")
  // console.log(parsedData)
  // console.log("mavpackettype= ",mavpackettype)

  // find webdrone object based on droneport:
  // console.log("handle_mavlink_message(parsedData,droneport) called ");
  let m_webdrone_object_to_update = window.m_Array_of_WebDrone_objects.find(item => item['droneID'] === droneport);
  // console.log("m_webdrone_object_to_update =  ",m_webdrone_object_to_update);
  m_webdrone_object_to_update.last_seen = Date.now();



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

    // Update webdrone object:
    m_webdrone_object_to_update.time_boot_ms = time_boot_ms;
    m_webdrone_object_to_update.lat = lat;
    m_webdrone_object_to_update.lon = lon;
    m_webdrone_object_to_update.alt = alt;
    m_webdrone_object_to_update.relative_alt = relative_alt;
    m_webdrone_object_to_update.vx = vx;
    m_webdrone_object_to_update.vy = vy;
    m_webdrone_object_to_update.vz = vz;
    m_webdrone_object_to_update.hdg = hdg;

    // update marker location on map
    // pseudocode: m_webdrone_object_to_update.marker.location=lat/lon
    updateDroneLoactionGeoJson(lat, lon); // function is in maps.js; droneLocationGeoJson is a variable in maps.js


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

    // Update webdrone object:
    m_webdrone_object_to_update.airspeed = airspeed;
    m_webdrone_object_to_update.groundspeed = groundspeed;
    m_webdrone_object_to_update.heading = heading;
    m_webdrone_object_to_update.throttle = throttle;
    m_webdrone_object_to_update.throttle = throttle;
    m_webdrone_object_to_update.climb = climb;


  };
  if (mavpackettype == "HEARTBEAT") {
    // Parse the HEARTBEAT message:
    // var MAV_TYPE = parsedData.MAV_TYPE; // type in message
    var type = parsedData.type;
    var base_mode = parsedData.base_mode;
    var custom_mode = parsedData.custom_mode;
    // Update the display:

    const dynamicTextElementtype = document.getElementById('type');
    // dynamicTextElementtype.textContent = type;
    dynamicTextElementtype.textContent = findMAV_TYPEFromNumber(type);

    const dynamicTextElementbase_mode = document.getElementById('base_mode');
    //dynamicTextElementbase_mode.textContent = base_mode;
    if (isArmed(base_mode)) {
      dynamicTextElementbase_mode.textContent = "ARMED";
    }
    else {
      dynamicTextElementbase_mode.textContent = "DISARMED";
    }

    const dynamicTextElementcustom_mode = document.getElementById('custom_mode');
    // dynamicTextElementcustom_mode.textContent = custom_mode;
    if (type == 1) { // fixed wing
      dynamicTextElementcustom_mode.textContent = findPlaneModeFromNumber(custom_mode);
    }
    else if (type == 2) { // quadroter
      dynamicTextElementcustom_mode.textContent = findCopterModeFromNumber(custom_mode);
    }
    else if (type == 10) { // rover
      dynamicTextElementcustom_mode.textContent = findRoverModeFromNumber(custom_mode);
    }
    else { // generic
      dynamicTextElementcustom_mode.textContent = custom_mode;

    }




    // Update webdrone object:
    m_webdrone_object_to_update.MAV_TYPE = type;
    m_webdrone_object_to_update.base_mode = base_mode;
    m_webdrone_object_to_update.custom_mode = custom_mode;




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

    // Update webdrone object:
    m_webdrone_object_to_update.voltage_battery = voltage_battery;
    m_webdrone_object_to_update.current_battery = current_battery;
    m_webdrone_object_to_update.battery_remaining = battery_remaining;

  };
  if (mavpackettype == "SYSTEM_TIME") {
    // Parse the SYSTEM_TIME message:
    var time_unix_usec = parsedData.time_unix_usec;
    // Update the display:
    const dynamicTextElementtime_unix_usec = document.getElementById('time_unix_usec');
    dynamicTextElementtime_unix_usec.textContent = time_unix_usec;

    // Update webdrone object:
    m_webdrone_object_to_update.time_unix_usec = time_unix_usec;

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

    // Update webdrone object:
    m_webdrone_object_to_update.drone_local_IP = drone_local_IP;
    m_webdrone_object_to_update.drone_remote_IP = drone_remote_IP;





  };
};

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
};
