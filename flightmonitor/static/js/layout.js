var tabNum = 0;
var tabID = new Map();
var tabContentMap = new Map();

function addTab(droneID) {
    tabNum++;
    var tabid = "tabDrone" + droneID.toString();
    tabID.set(droneID, tabid)
    var tabcontent = 'contentDrone' + droneID.toString();
    var altitudeID = 'altitude' + droneID.toString();
    var longitudeID = 'longitude' + droneID.toString();
    var latitudeID = 'latitude' + droneID.toString();
    var yawID = 'Yaw' + droneID.toString();
    var rollID = 'Roll' + droneID.toString();
    var pitchID = 'Pitch' + droneID.toString();
    var groundID = 'GroundSpeed' + droneID.toString();
    var distanceID = 'Distance' + droneID.toString();

    $('#tab-list').append($('<li><a class = "tabTitle" id="title' + droneID.toString() + '" role="tab" data-toggle="tab"><span>Drone ' + droneID + '<button onclick = "showDrone(' + droneID.toString() + ')"></button></span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> </a></li>'));
    $('#tab-content').append($('<div class="tab" id = "content' + droneID.toString() + '">' +
        '<table id = "infobox">' +
        '<tr><th>Altitude (m)</th> <th>Ground Speed (m/s)</th></tr>' +
        '<tr><td>' + '<var id = ' + altitudeID + '></var>' + '</td><td>' + '<var id = ' + groundID + '></var>' + '</td></tr>' +
        '<tr><th>Roll (deg/s)</th><th>Yaw (deg)</th></tr>' +
        '<tr><td>' + '<var id = ' + rollID + '></var>' + '</td><td>' + '<var id = ' + yawID + '></var>' + '</td></tr>' +
        '<tr><th>Distance to Destination (m)</th><th>Pitch </th></tr>' +
        '<tr><td>' + '<var id = ' + distanceID + '></var>' + '</td><td>' + '<var id = ' + pitchID + '></var>' + '</td></tr>' +
        '<tr><th>Longitude</th><th>Latitude</th></tr>' +
        '<tr><td>' + '<var id = ' + longitudeID + '></var>' + '</td><td>' + '<var id = ' + latitudeID + '></var>' + '</td></tr></table>'));
    var contents = document.getElementsByClassName("tab"); // list of TabContent
    for (i = 0; i < contents.length; i++) {
        contents[i].className = "tab-pane";
    }
    document.getElementById("content" + droneID).className = "tab";
}

//
function showDrone(droneID) {
    var currentContent = "content" + droneID;
    currDrone = droneID;
    let i;
    droneID = parseInt(droneID);
    let contents = document.getElementsByClassName("tab"); // list of TabContent

    for (i = 0; i < contents.length; i++) {
        contents[i].className = "tab-pane";
    }
    document.getElementById(currentContent).className = "tab";
}

function setDefaultTab(droneID) {
    tabNum--;
    tabID.delete(droneID);
    if (tabNum == 0) {
        return false;
    } else if (droneID == currDrone) {
        let i = 0;
        let contents = document.getElementsByClassName("tab"); // list of TabContent
        for (i; i < contents.length; i++) {
            contents[i].className = "tab-pane";
        }
        let currentID = tabID.keys().next().value;
        let currentContent = "content" + currentID.toString();
        document.getElementById(currentContent).className = "tab";

        // contents[0].className = "tab";
    }
}
