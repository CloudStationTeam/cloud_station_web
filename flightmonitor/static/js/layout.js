var tabNum = 0;
var tabID = new Map();
var tabContentMap = new Map();

function addTab(droneID) {
    tabNum++;
    let tabid = "tabDrone" + droneID.toString();
    tabID.set(droneID, tabid)
    let tabcontent = 'contentDrone' + droneID.toString();
    let altitudeID = 'altitude' + droneID.toString();
    let longitudeID = 'longitude' + droneID.toString();
    let latitudeID = 'latitude' + droneID.toString();
    let yawID = 'Yaw' + droneID.toString();
    let rollID = 'Roll' + droneID.toString();
    let pitchID = 'Pitch' + droneID.toString();
    let groundID = 'GroundSpeed' + droneID.toString();
    let distanceID = 'Distance' + droneID.toString();
    let typeID = 'Type' + droneID.toString();
    let flyModeID = 'FlyModeID' + droneID.toString();
    let fixTypeID = 'FixTypeID' + droneID.toString();
    let satellitesID = 'SatellitesID' + droneID.toString();
    let vccID = 'VccID' + droneID.toString();
    let vservoID = 'VservoID' + droneID.toString();

// + '<button onclick = "showDrone(' + droneID.toString() + ')"></button>
    $('#tab-list').append($('<li><button class = "tabTitle" id="title' + droneID.toString() + '" role="tab" data-toggle="tab" onclick = "showDrone(' + droneID.toString() + ')"><span>Drone ' + droneID + '</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> </button></li>'));
    $('#tab-content').append($('<div class="tab" id = "content' + droneID.toString() + '">' +
        '<table id = "infobox">' +
        '<tr><th>Altitude (m)</th> <th>Ground Speed (m/s)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + altitudeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + groundID + '></var>' + '</td></tr>' +
        '<tr><th>Roll (deg/s)</th><th>Yaw (deg)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + rollID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + yawID + '></var>' + '</td></tr>' +
        '<tr><th>Distance to Destination (m)</th><th>Pitch </th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + distanceID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + pitchID + '></var>' + '</td></tr>' +
        '<tr><th>Longitude</th><th>Latitude</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + longitudeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + latitudeID + '></var>' + '</td></tr>' +
        '<tr><th>Type</th><th>Flight Mode</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + typeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + flyModeID + '></var>' + '</td></tr>' +
        '<tr><th>Fix Type</th><th>Satellites Visible</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + fixTypeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + satellitesID + '></var>' + '</td></tr>' +
        '<tr><th>VCC</th><th>VSERVO</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + vccID + '></var>' + '</td><td>' + '<var id = ' + vservoID + '></var>' + '</td></tr>' +
        '</table>'));
    var contents = document.getElementsByClassName("tab"); // list of TabContent
    for (i = 0; i < contents.length; i++) {
        contents[i].className = "tab-pane";
    }
    document.getElementById("content" + droneID).className = "tab";
}

//
function showDrone(droneID) {
    if (currDrone != droneID) {
        if(currDrone!=null)
            document.getElementById("title" + currDrone.toString()).style.background = "palevioletred";
        var currentContent = "content" + droneID;
        currDrone = droneID;
        let i;
        droneID = parseInt(droneID);
        let contents = document.getElementsByClassName("tab"); // list of TabContent

        for (i = 0; i < contents.length; i++) {
            contents[i].className = "tab-pane";
        }
        document.getElementById(currentContent).className = "tab";
        document.getElementById("title" + droneID.toString()).style.background = "red";
    }
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
        document.getElementById("title" + currentID.toString()).style.background = "red";
        currDrone = currentID;

        // contents[0].className = "tab";
    }
}
