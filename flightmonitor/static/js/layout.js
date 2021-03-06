var tabNum = 0;
var tabID = new Map();
var tabContentMap = new Map();

// Get tab ID based on drone ID
function getTabId(droneId) {
    return "tabDrone" + droneId.toString();
}

// Id of tab for each drone
function getHtmlTabId(droneId) {
    return "content" + droneId.toString();
}

function getDroneIdFromTabName(tabName) {
    return tabName.slice(7)
}

// Id of "Extra Info" table for each drone
function getExtraInfoTableId(droneId) {
    return "extraInfo" + droneId.toString();
}

function addTab(droneID) {
    tabNum++;
    let tabid = getTabId(droneID);
    tabID.set(droneID, tabid);
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

    $('#tab-list').append($('<li><button class = "tabTitle" id="title' + droneID.toString() + '" role="tab" data-toggle="tab" onclick = "showDrone(' + droneID.toString() + ')"><span>Drone ' + droneID + '</span></button></li>'));
    $('#tab-content').append($('<div class="tab" id = "' + getHtmlTabId(droneID) + '">' +
        '<table class = "infobox">' +
        '<tr><th>Altitude (m)</th><th>Pitch (rad)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + altitudeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + pitchID + '></var>' + '</td></tr>'+
        '<tr><th>Roll (rad)</th><th>Yaw (rad)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + rollID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + yawID + '></var>' + '</td></tr>' +
        '<tr><th>Longitude</th><th>Latitude</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + longitudeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + latitudeID + '></var>' + '</td></tr>' +
        '<tr><th>Type</th><th>Flight Mode</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + typeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + flyModeID + '></var>' + '</td></tr>' +
        '<tr><th>Fix Type</th><th>Satellites Visible</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + fixTypeID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + satellitesID + '></var>' + '</td></tr>' +
        '<tr><th>VCC (mV)</th><th>VSERVO (mV)</th></tr>' +
        '<tr><td>' + '<var class="contentValue" id = ' + vccID + '></var>' + '</td><td>' + '<var class="contentValue" id = ' + vservoID + '></var>' + '</td></tr>' +
        '</table>' +
        '<h4>Other Data</h4>' +
	'<button id="telemetryEditBtn" onclick="openForm()">Edit Other Data <span class="glyphicon glyphicon-pencil text-muted edit"></span></button>' +
        '<table class = "infobox" id = "' + getExtraInfoTableId(droneID) + '"></table">'));
    var contents = document.getElementsByClassName("tab"); // list of TabContent
    for (i = 0; i < contents.length; i++) {
        contents[i].className = "tab-pane";
    }
    document.getElementById("content" + droneID).className = "tab";
}

function getExtraDataCellName(field, category, droneId) {
    return field + "_" + category + "_" + droneId.toString()
}

// Refresh fields in "extra data" for each drone.
// Removes existing elements and re-adds elements in "fields" param.
function updateExtraData(fields) {
    $('.tab, .tab-pane').each(function() {
        droneId = getDroneIdFromTabName($(this).prop('id'))
        $('#' + getExtraInfoTableId(droneId)).empty()
        for (const [key, value] of Object.entries(fields)) {
	    $('#' + getExtraInfoTableId(droneId)).append($('<h4 class="extra-info-header">'+key+'</h4>'));
            for (field of value) {
                $('#' + getExtraInfoTableId(droneId)).append($('<tr><th>' + field +'</th></tr>' +
                                                                '<tr><td><var class="contentValue" id = ' + getExtraDataCellName(field, key, droneId) + '></var></td></tr>'));
            }
        }
    })
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
