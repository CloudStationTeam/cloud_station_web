const addressInput = document.getElementById("address-input");
const suggestedAddressesContainer = document.getElementById("suggested-addresses-container");
const addAddressButton = document.getElementById("add-address");
const clearAllButton = document.getElementById("clear-all");
const waypointListContainer = document.getElementById("waypoint-list-container");


const showAllWPsButton = document.getElementById("show-all-wps");
const clearAllWPsButton = document.getElementById("clear-all-wps");
const waypointListsContainer = document.getElementById("waypoint-lists-container");


const droneid1 = document.getElementById("droneid1"); //WO / For Write. 
const droneid2 = document.getElementById("droneid2"); //RO / For Read. 
const update_droneid = document.getElementById("update-droneid");
const send_droneid = document.getElementById("send-droneid");


//alert("1");
let wpLists = {}; //map

let droneid = null; //tmp. 



// Function to display all waypoint lists
function showAllWaypoints() {
  waypointListsContainer.innerHTML = ''; // Clear all existing content

  for (let droneID in wpLists) {
    let list = wpLists[droneID];
    
    const listDiv = document.createElement('div');
    listDiv.innerHTML = `droneID: ${droneID}<br>Waypoint List:<br>${list.join('<br>')}<br><br>`;
    waypointListsContainer.appendChild(listDiv);
  }
}

// Function to clear all waypoint lists
function clearAllWaypoints() {
  wpLists = {}; // Clear the map
  waypointListsContainer.innerHTML = ''; // Clear the display container
  
  waypointListContainer.innerHTML = '';
}

// Event listener for the "Show All Waypoint Lists" button
showAllWPsButton.addEventListener('click', showAllWaypoints);

// Event listener for the "Clear All Waypoint Lists" button
clearAllWPsButton.addEventListener('click', clearAllWaypoints);

droneid2.addEventListener("input", () => {
  const droneid = filterit(droneid2.value);
  if (!droneid) {
    update_droneid.click();
  }
});
addressInput.addEventListener("input", async () => {
  const value = filterit(addressInput.value.trim());
  console.log(value);
  
  // Clear the previous suggestions
  suggestedAddressesContainer.innerHTML = "";
  
  if (value.length === 0) {
    return;
  }
  
  // Call the function with a query 
  let suggestedAddresses = null;
  try {
        let data = await autocomplete(String(value)); //a proms of json
        data = JSON.parse(data) // Ref: https://www.w3schools.com/js/js_json_objects.asp
        //alert(data);
        suggestedAddresses = data.predictions; 
    } catch (error) {
        console.error(error);
  }
  
  // Create suggestion items and append them to the container
  suggestedAddresses.forEach(item => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggested-address");
    //alert(item);
    suggestion.textContent = item.description;
    suggestion.addEventListener("click", () => {
      addressInput.value = item.description;
      suggestedAddressesContainer.innerHTML = "";
    });
    suggestedAddressesContainer.appendChild(suggestion);
  });
});


//3. Send wps
//wpLists[droneid]
send_droneid.addEventListener("click", () => {
  //check
  const droneid = filterit(droneid2.value);
  if (!(droneid in wpLists)) {
    alert("No such droneid.");
    return;
  }
  if (wpLists[droneid].length < 2) {
    alert("WPs less than 2.");
    return;
  }
  
  //filter
  let addrs = [];
  let lst = wpLists[droneid];
  for (let item of lst) { //1. 1 Shields Ave. 
    //https://logfetch.com/js-split-string-first-occurrence/
    let addr = item.split(". ").slice(1).join(". "); // 1 Shields Ave.
    addrs.push(addr); //1 Shields Ave.
  }
  
  //send
  send_waypoints(droneid, addrs);
  
  //clear
  clearAllButton.click();
})
  

//2. Show wps 
update_droneid.addEventListener("click", () => {
  const droneid = filterit(droneid2.value);
  if (!(droneid in wpLists)) {
    //alert("No such droneid.");
    waypointListContainer.innerHTML = "";
    return;
  }
  //clearAllButton.click(); //do Not do it. it removes other addrs. 
  waypointListContainer.innerHTML = "";
  //for (addr in wpLists[droneid]) {
  for (var i = 0; i < wpLists[droneid].length; i++) {
    let addr = wpLists[droneid][i];
    renderWaypointList(addr);
  }
});


// 1. Add a wp 
addAddressButton.addEventListener("click", () => {
  var address = filterit(addressInput.value); //ref.
  const droneid = filterit(droneid1.value);
  if (address=="" || droneid=="") {
alert("Null.")
return;
  }

  // Add the address to the waypoint list
  if (!(droneid in wpLists)) {
    wpLists[droneid] = [];
}
  //checks for duplicates 
  address = (wpLists[droneid].length+1).toString() + ". " + address;
  wpLists[droneid].push(address);
  //send_waypoint(droneid, address);

  // Clear the input field
  addressInput.value = "";
  suggestedAddressesContainer.innerHTML = '';

  // Update the waypoint list display
  if (droneid == droneid2.value) {
    renderWaypointList(address);
  }
  
  showAllWaypoints();
});


clearAllButton.addEventListener("click", () => {
  // Clear all waypoint lists and the display
  let droneid = filterit(droneid2.value);
  if (!(droneid in wpLists)) {
    alert("No such droneid.");
    return;
  } 
  wpLists[droneid] = [];
  waypointListContainer.innerHTML = "";
  
  showAllWaypoints();
});


function renderWaypointList(address) {
  // Create a new <div> element for the address
  const divElement = document.createElement("div");

  // Add the desired class to the divElement
  divElement.classList.add("waypoint");
  
  // Create a <span> element to display the address
  const addressSpan = document.createElement("span");
  addressSpan.textContent = address;
  
  // Create a remove button
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove");
  removeButton.textContent = "Remove";
  
  // Add event listener to remove the address when the button is clicked
  removeButton.addEventListener("click", () => {
    let droneid = filterit(droneid2.value);
    if (!(droneid in wpLists)) {
    alert("No such droneid.");
    return;
  } 
    //could be opt. by n.
    var idx = wpLists[droneid].indexOf(address);
if (idx !== -1) {
  wpLists[droneid].splice(idx, 1);
}
    divElement.remove();

    //sort the rest 
    let tmp = wpLists[droneid];
    wpLists[droneid] = [];
    
    let seq = 1;
    for (let item of tmp) {
      //let item1 = [seq.toString() ...(item.split(". ").slice(1))].join(". "); 
      let parts = item.split(". ").slice(1); 
      let item1 = [seq.toString(), ...parts].join(". "); 
      wpLists[droneid].push(item1);
      seq += 1;
    }
    update_droneid.click();

    showAllWaypoints();
  });
  
  // Append the address and remove button to the <div> element
  divElement.appendChild(addressSpan);
  divElement.appendChild(removeButton);
  
  // Append the <div> element to the container div_a
  waypointListContainer.appendChild(divElement);
}


function filterit(input) {
  var sanitizedInput = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return sanitizedInput;
} //avoid XSS.


function send_waypoints(droneId, addrs) {
    alert("Send Waypoints. \n" + 
          "DrondID: " + droneId.toString() + "\n" + 
          "Waypoints: " + addrs.toString());
          
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () { //on_click(). 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let addrs1 = addrs.map(encodeURIComponent).join('|'); // Process the addrs array //["a1, b1", "a2, b2"] 
    console.log(addrs1); //a1%b1|a2%b2 
    let url = '/flight_data_collect/control/waypoints/' + droneId.toString() + '/' + addrs1 + '/';
    xmlHttp.open("GET", url, true); // asynchronous 
    xmlHttp.send(null);
}


function autocomplete(addr) {
    //JS sends a GET req to PY. It waits for PY to send a GET req to API. 
    return new Promise((resolve, reject) => {
        //alert("auto");
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let responseText = xmlHttp.responseText;
                    document.querySelector('#telemetry-log').value += (responseText + '\n');
                    resolve(responseText);
                } else {
                    reject(new Error(`HTTP error: ${xmlHttp.status}`));
                }
            }
        };
        let url = '/flight_data_collect/control/autocomplete/' + addr.toString() + '/';
        xmlHttp.open("GET", url, true); // asynchronous 
        xmlHttp.send(null);
    });
}

