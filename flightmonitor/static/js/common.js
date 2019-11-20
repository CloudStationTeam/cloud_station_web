var long = 32;
var lat = 96;

var browserSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/flightmonitor/');
document.querySelector('#telemetry-log').value += ('Successfully connected to server.\n');

browserSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    document.querySelector('#telemetry-log').value += (message + 'sadfdsafsadf\n');
    var temp = JSON.parse(data['message']);
    long = temp['longitude'];
    lat = temp['latitude'];
    console.log(long, lat);
    
};

browserSocket.onclose = function (e) {
    document.querySelector('#telemetry-log').value += ('Error: connection to server has been disconnected\n');
};


document.querySelector('#vehicleID').focus();
document.querySelector('#vehicleID').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#connectbtn').click();
    }
};

function connectVehicle() {
    var message = document.getElementById("vehicleID").value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    var url = '/flight_data_collect/connect/' + message + '/';
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function disconnectVehicle() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    var url = '/flight_data_collect/disconnect/';
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}