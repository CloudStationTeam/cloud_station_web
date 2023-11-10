const addressInput = document.getElementById("address-input");
const suggestedAddressesContainer = document.getElementById("suggested-addresses-container");
const addAddressButton = document.getElementById("add-address");
const clearAllButton = document.getElementById("clear-all");
const waypointListContainer = document.getElementById("waypoint-list-container");

const droneid1 = document.getElementById("droneid1"); //WO
const droneid2 = document.getElementById("droneid2"); //RO
const update_droneid = document.getElementById("update-droneid");

//alert("1");
let wpLists = {}; //map
//wpLists[n] = []; //wp list

let droneid = null;


async function getPoints(query) {
  let lat = null;
  let lon = null;
  
  // Check if geolocation is available
  if (navigator.geolocation) {
    // Get the current position
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    
    lat = position.coords.latitude;
    lon = position.coords.longitude;
  } else {
    // Set UC Irvine coordinates as default if geolocation is not available
    lat = 33.6431;
    lon = -117.8419;
  }
  
  let points = []
  points.push(lat)
  points.push(lon)
  return points 
}


function getClientLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log('Latitude:', latitude, 'Longitude:', longitude);
                    resolve({ latitude, longitude });  // Returning the values
                },
                function(error) {
                    console.error('Error obtaining location:', error.message);
                    reject(error);  // Rejecting with error in case of failure
                },
                {
                    enableHighAccuracy: true, // Enables high-accuracy mode if available
                    timeout: 10000,           // Maximum time to wait for a result (in milliseconds)
                    maximumAge: 0             // Accept a cached position whose age is no greater than specified
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}


let loc = null;
getClientLocation()
    .then(location => {
        console.log(location);  // Logs the object: { latitude: ..., longitude: ... }
        loc = location;
    })
    .catch(error => {
        console.error(error);
    });


/*
// Function to retrieve suggested addresses from the Nominatim API
// Google Map API is probably better but it costs money.
async function getSuggestedAddresses(query) {
  //const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`);
//let points = await getPoints();
//let lat = points[0]
//let lon = points[1]

let lat = 33.6431;
let lon = -117.8419;
  
let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&lat=${lat}&lon=${lon}`;

  //var url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(query)}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }

}
*/


addressInput.addEventListener("input", async () => {
  const value = addressInput.value.trim();
  
  // Clear the previous suggestions
  suggestedAddressesContainer.innerHTML = "";
  
  if (value.length === 0) {
    return;
  }
  
  // Get the suggested addresses from the Nominatim API
  //const suggestedAddresses = await getSuggestedAddresses(value);
  
  // Call the function with a query
  //const suggestedAddresses = getAutocompleteResults('1 Shields Ave., Davis, CA 95616');
  let suggestedAddresses = null;
  try {
        //alert("?")
        let data = await autocomplete(String(value)); //a proms of json
        //alert(response);
        /*
        if (!response.ok) {
            alert("???")
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        */
        //alert(data)
        //alert(2)
        //alert(data.predictions)
        data = JSON.parse(data) // Ref: https://www.w3schools.com/js/js_json_objects.asp
        suggestedAddresses = data.predictions; 
    } catch (error) {
        console.error(error);
  }
  //alert(suggestedAddresses[1].description)
  //alert(1)
  
  // Create suggestion items and append them to the container
  suggestedAddresses.forEach(item => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggested-address");
    suggestion.textContent = item.description;
    suggestion.addEventListener("click", () => {
      addressInput.value = item.description;
      suggestedAddressesContainer.innerHTML = "";
    });
    suggestedAddressesContainer.appendChild(suggestion);
  });
});

update_droneid.addEventListener("click", () => {
  const droneid = filterit(droneid2.value);
  if (!(droneid in wpLists)) {
    alert("No such droneid.");
    return;
  }
  //clearAllButton.click();
  waypointListContainer.innerHTML = "";
  //for (addr in wpLists[droneid]) {
  for (var i = 0; i < wpLists[droneid].length; i++) {
    let addr = wpLists[droneid][i];
    renderWaypointList(addr);
  }
});

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
  address = (wpLists[droneid].length+1).toString() + ". " + address;
  wpLists[droneid].push(address);
  send_waypoint(droneid, address);

  // Clear the input field
  addressInput.value = "";

  // Update the waypoint list display
  if (droneid == droneid2.value) {
    renderWaypointList(address);
  }
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
});

function renderWaypointList(address) {
  //alert(address);
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
} //avoid xss.
//1. Add it to py. avoid sql.

function send_waypoint(droneId, addr) {
    alert("wp");
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            document.querySelector('#telemetry-log').value += (xmlHttp.responseText + '\n');
    };
    let url = '/flight_data_collect/control/waypoints/' + droneId.toString() + '/' + addr.toString() + '/';
    xmlHttp.open("GET", url, true); // asynchronous 
    xmlHttp.send(null);
}
//2. remove. clearall. todo.


function autocomplete(addr) {
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

