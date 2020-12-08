var tabNum = 0;
var tabID = new Map();
var tabContentMap = new Map();

// Get tab ID based on drone ID
function getTabId(droneId) {
    return "tabDrone" + droneID.toString();
}

function getHtmlTabId(droneID) {
    return "content" + droneID.toString();
}

function addTab(droneID) {
    tabNum++;
    let tabid = getTabId(droneID);
    tabID.set(droneID, tabid)
    let tabContent = getHtmlTabId(droneID);
    let altitudeID = 'altitude' + droneID.toString();
    let longitudeID = 'longitude' + droneID.toString();
    let latitudeID = 'latitude' + droneID.toString();
    let yawID = 'Yaw' + droneID.toString();
    let rollID = 'Roll' + droneID.toString();
    let pitchID = 'Pitch' + droneID.toString();
    let typeID = 'Type' + droneID.toString();
    let flyModeID = 'FlyModeID' + droneID.toString();
    let fixTypeID = 'FixTypeID' + droneID.toString();
    let satellitesID = 'SatellitesID' + droneID.toString();
    let vccID = 'VccID' + droneID.toString();
    let vservoID = 'VservoID' + droneID.toString();

    $('#tab-list').append($('<li><button class = "tabTitle" id="title' + droneID.toString() + '" role="tab" data-toggle="tab" onclick = "showDrone(' + droneID.toString() + ')"><span>Drone ' + droneID + '</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> </button></li>'));
    $('#tab-content').append($('<div class="tab" id = "' + tabContent + '">' +
        '<table id = "infobox">' +
        '<tr><th>Altitude (m)</th><th>Pitch (deg)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + altitudeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + pitchID + '></var>' + '</td></tr>'+
        '<tr><th>Roll (deg)</th><th>Yaw (deg)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + rollID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + yawID + '></var>' + '</td></tr>' +
        '<tr><th>Longitude</th><th>Latitude</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + longitudeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + latitudeID + '></var>' + '</td></tr>' +
        '<tr><th>Type</th><th>Flight Mode</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + typeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + flyModeID + '></var>' + '</td></tr>' +
        '<tr><th>Fix Type</th><th>Satellites Visible</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + fixTypeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + satellitesID + '></var>' + '</td></tr>' +
        '<tr><th>VCC</th><th>VSERVO</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + vccID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + vservoID + '></var>' + '</td></tr>' +
        '</table>' +
        '<h2>Other Data</h2><table id = "extradata"></table>'));
    var contents = document.getElementsByClassName("tab"); // list of TabContent
    for (i = 0; i < contents.length; i++) {
        contents[i].className = "tab-pane";
    }
    document.getElementById("content" + droneID).className = "tab";


}


function showDrone(droneID) {
    if (currSelectedDroneId != droneID) {
        if (currSelectedDroneId != null)
            document.getElementById("title" + currSelectedDroneId.toString()).style.background = "rgba(246, 91, 2, 0.5)";
        var currentContent = "content" + droneID;
        droneID = parseInt(droneID);
        currSelectedDroneId = droneID;
        let contents = document.getElementsByClassName("tab"); // list of TabContent

        for (i = 0; i < contents.length; i++) {
            contents[i].className = "tab-pane";
        }
        document.getElementById(currentContent).className = "tab";
        document.getElementById("title" + droneID.toString()).style.background =  'rgba(247, 18, 2, 0.836)';
        map.flyTo({ center: droneMap.get(droneID).getLocation() });
    }
}

function setDefaultTab(droneID) {
    tabNum--;
    tabID.delete(droneID);
    if (tabNum == 0) {
        return false;
    } else if (droneID == currSelectedDroneId) {
        let i = 0;
        let contents = document.getElementsByClassName("tab"); // list of TabContent
        for (i; i < contents.length; i++) {
            contents[i].className = "tab-pane";
        }
        let currentID = tabID.keys().next().value;
        let currentContent = "content" + currentID.toString();
        document.getElementById(currentContent).className = "tab";
        document.getElementById("title" + currentID.toString()).style.background =  'rgba(247, 18, 2, 0.836)';
        currSelectedDroneId = currentID;
        map.flyTo({ center: droneMap.get(currentID).getLocation() });
    }
}
