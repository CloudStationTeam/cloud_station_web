mapboxgl.accessToken = 'pk.eyJ1IjoidG9tYXRvYm9iY2F0IiwiYSI6ImNqejhveTZzNzFubzkzY20ya2ZlbHB0azEifQ.DB5so0XX0ddlaYkEVF0zSg';  // TODO add your API public access token to .env

function openNav() {
  document.getElementById("mySidebar").style.width = "275px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
var droneLocation = [-117.842816, 33.646050];
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: droneLocation, // starting position [lng, lat]
  zoom: 13// starting zoom
});

var droneLocationGeoJson = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": droneLocation
  }
};

function updateDroneLoactionGeoJson(longitude, latitude) {
  droneLocationGeoJson["geometry"]["coordinates"] = [longitude, latitude];

}

// map.on('load', function () {
//   window.setInterval(function () {
//     map.getSource('drone').setData(droneLocationGeoJson);
//   }, 20);
//   map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BSicon_AIRCLUB.svg/1920px-BSicon_AIRCLUB.svg.png', function (error, image) {
//     if (error) throw error;
//     map.addImage('cat', image);
//     map.addSource('drone', { type: 'geojson', data: droneLocationGeoJson });
//     map.addLayer({
//       "id": "drone",
//       "type": "symbol",
//       "source": "drone",
//       "layout": {
//         "icon-image": "cat",
//         "icon-size": 0.04
//       }
//     });
//   });
// });
map.addControl(new mapboxgl.NavigationControl());
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
);

map.on('mousemove', function(e) {
document.getElementById('info').innerHTML =
// e.point is the x, y coordinates of the mousemove event relative
// to the top-left corner of the map
JSON.stringify(e.point) +
'<br />' +
// e.lngLat is the longitude, latitude geographical position of the event
JSON.stringify(e.lngLat.wrap());
});