var tabNum = 0;
var tabID = new Map();
var tabContentMap = new Map();
function addTab(droneID){
    tabNum ++;
    var tabid = "tabDrone" + droneID.toString();
    tabID.set(droneID, tabid)
    var tabcontent = 'contentDrone' + droneID.toString();
    var altitudeID = 'altitude' + droneID.toString();
    var longitudeID = 'longitude' + droneID.toString();
    var latitudeID = 'latitude' + droneID.toString();
    var yawID = 'Yaw'  + droneID.toString();
    var rollID = 'Roll' + droneID.toString();
    var pitchID ='Pitch'  + droneID.toString();
    var groundID = 'GroundSpeed' + droneID.toString();
    var distanceID = 'Distance' + droneID.toString();

    $('#tab-list').append($('<li><a class = "tabTitle" id="title' + droneID.toString() + '" role="tab" data-toggle="tab"><span>Drone ' + droneID + '<button onclick = "showDrone('+ droneID.toString()+')"></button></span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> </a></li>'));
    $('#tab-content').append($('<div class="tab" id = "content'+ droneID.toString()+ '">' +
        '<table id = "infobox">'+
        '<tr><th>Altitude (m)</th> <th>Ground Speed (m/s)</th></tr>'+
        '<tr><td>' + '<var id = '+ altitudeID +'></var>' + '</td><td>' + '<var id = '+ groundID +'></var>' + '</td></tr>'+
        '<tr><th>Roll (deg/s)</th><th>Yaw (deg)</th></tr>' +
        '<tr><td>' + '<var id = '+ rollID +'></var>' + '</td><td>' + '<var id = '+ yawID +'></var>' + '</td></tr>'+
        '<tr><th>Distance to Destination (m)</th><th>Pitch </th></tr>' +
        '<tr><td>' + '<var id = '+ distanceID +'></var>' + '</td><td>' + '<var id = '+ pitchID +'></var>' + '</td></tr>'+
        '<tr><th>Longitude</th><th>Latitude</th></tr>' +
        '<tr><td>' + '<var id = '+ longitudeID +'></var>' + '</td><td>' + '<var id = '+ latitudeID +'></var>' + '</td></tr></table></div>'
    ));
    var contents = document.getElementsByClassName("tab"); // list of TabContent
    for(i = 0; i < contents.length; i++)
    {
        contents[i].className = "tab-pane";
    }
    document.getElementById("content" + droneID).className = "tab";
    // document.getElementById("content").style.display = "block";
    // tabContentMap.set(droneID, tabcontent);
    // tabContentMap.get(droneID).style.display = "block";

}
//
function showDrone(droneID){
    var currentContent = "content" + droneID;
    var i;
    droneID = parseInt(droneID);
    var contents = document.getElementsByClassName("tab"); // list of TabContent
    for(i = 0; i < contents.length; i++)
    {
        contents[i].className = "tab-pane";
    }
    document.getElementById(currentContent).className = "tab";
    // var i;
    // var tabcontent = document.getElementsByClassName("tabcontent");
    // for (i = 0; i < tabcontent.length; i++){
    //     tabcontent[i].style.display = "none"
    // }
    // var tabTitle = document.getElementsByClassName("tabTitle");
    // for (i = 0; i < tabTitle.length ; i++){
    //     tabTitle[i].className = tabTitle[i].className.replace(" active", "");
    // }
    // var currentTabTitle = "title" + droneID.toString();
    // var currentTabContent = "content" + droneID.toString();
    // currentTabTitle = document.getElementById(currentTabTitle);
    // currentTabContent = document.getElementById(currentTabContent);
    // currentTabTitle.className += " active";
    // currentTabContent.style.display = "block";
}


