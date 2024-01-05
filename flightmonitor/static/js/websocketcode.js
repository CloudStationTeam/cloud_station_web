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
};

browserSocket.onclose = function (e) {
    console.log("[LOG] Websocket closed.\n")
};

// Sends a message to the server (and prints it to the console)
function doSend(message) {
    console.log("Sending: " + message);
    browserSocket.send(message);
}

