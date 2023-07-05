const addressInput = document.getElementById("address-input");
const suggestedAddressesContainer = document.getElementById("suggested-addresses-container");
const addAddressButton = document.getElementById("add-address");
const clearAllButton = document.getElementById("clear-all");
const waypointListContainer = document.getElementById("waypoint-list-container");
let waypointList = [];

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

// Function to retrieve suggested addresses from the Nominatim API
// Google Map API is probably better but it costs money.
async function getSuggestedAddresses(query) {
  //const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`);
  /*
let points = await getPoints();
let lat = points[0]
let lon = points[1]
*/

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

addressInput.addEventListener("input", async () => {
  const value = addressInput.value.trim();
  
  // Clear the previous suggestions
  suggestedAddressesContainer.innerHTML = "";
  
  if (value.length === 0) {
    return;
  }
  
  // Get the suggested addresses from the Nominatim API
  const suggestedAddresses = await getSuggestedAddresses(value);
  
  // Create suggestion items and append them to the container
  suggestedAddresses.forEach(item => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggested-address");
    suggestion.textContent = item.display_name;
    suggestion.addEventListener("click", () => {
      addressInput.value = item.display_name;
      suggestedAddressesContainer.innerHTML = "";
    });
    suggestedAddressesContainer.appendChild(suggestion);
  });
});

addAddressButton.addEventListener("click", () => {
  const address = addressInput.value; //ref.
  send_waypoint(droneId, address);
  
  // Add the address to the waypoint list
  waypointList.push(address);

  // Clear the input field
  addressInput.value = "";

  // Update the waypoint list display
  renderWaypointList(address);
});

clearAllButton.addEventListener("click", () => {
  // Clear all waypoint lists and the display
  waypointList = [];
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
    divElement.remove();
  });
  
  // Append the address and remove button to the <div> element
  divElement.appendChild(addressSpan);
  divElement.appendChild(removeButton);
  
  // Append the <div> element to the container div_a
  waypointListContainer.appendChild(divElement);
}

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

