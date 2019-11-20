mapboxgl.accessToken = 'pk.eyJ1IjoidG9tYXRvYm9iY2F0IiwiYSI6ImNqejhveTZzNzFubzkzY20ya2ZlbHB0azEifQ.DB5so0XX0ddlaYkEVF0zSg';  // TODO add your API public access token to .env

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-74.5,40],
    zoom:9
});

  function openNav() {
    document.getElementById("mySidebar").style.width = "275px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }
  var drone_location = [-117.8443, 33.6405];
  var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: drone_location, // starting position [lng, lat]
    zoom: 9 // starting zoom
  });

//import myImage from 'plane.png';
  map.on('load', function() {
map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BSicon_AIRCLUB.svg/1920px-BSicon_AIRCLUB.svg.png', function(error, image) {
if (error) throw error;
map.addImage('cat', image);
map.addLayer({
"id": "points",
"type": "symbol",
"source": {
"type": "geojson",
"data": {
"type": "FeatureCollection",
"features": [{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": drone_location
}
}]
}
},
"layout": {
"icon-image": "cat",
"icon-size": 0.04
}
});
});
});

  function disconnectResult() {
    alert("Disconnected Successfully!");
  }
  function sendingResult() {
    alert("Successfully Sent!");
  }

function connectResult() {
    alert("Connected Successfully!");
  }

  function FailConnection() {
      alert("Fail to Connect!");
  }

// var size = 200;

// var pulsingDot = {
//     width: size,
//     height: size,
//     data: new Uint8Array(size * size * 4),

//     onAdd: function() {
//         var canvas = document.createElement('canvas');
//         canvas.width = this.width;
//         canvas.height = this.height;
//         this.context = canvas.getContext('2d');
//     },

//     render: function() {
//         var duration = 1000;
//         var t = (performance.now() % duration) / duration;

//         var radius = size / 2 * 0.3;
//         var outerRadius = size / 2 * 0.7 * t + radius;
//         var context = this.context;

//         // draw outer circle
//         context.clearRect(0, 0, this.width, this.height);
//         context.beginPath();
//         context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
//         context.fill();

//         // draw inner circle
//         context.beginPath();
//         context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(255, 100, 100, 1)';
//         context.strokeStyle = 'white';
//         context.lineWidth = 2 + 4 * (1 - t);
//         context.fill();
//         context.stroke();

//         // update this image's data with data from the canvas
//         this.data = context.getImageData(0, 0, this.width, this.height).data;

//         // keep the map repainting
//         map.triggerRepaint();

//         // return `true` to let the map know that the image was updated
//         return true;
//     }
// };

// map.on('load', function () {

//     map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

//     map.addLayer({
//         "id": "points",
//         "type": "symbol",
//         "source": {
//             "type": "geojson",
//             "data": {
//                 "type": "FeatureCollection",
//                 "features": [{
//                     "type": "Feature",
//                     "geometry": {
//                         "type": "Point",
//                         "coordinates": [-117.826623,33.645964]
//                     }
//                 }]
//             }
//         },
//         "layout": {
//             "icon-image": "pulsing-dot"
//         }
//     });
// });