// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyBEgb15uKQSfReeafXrPi12uRvnIWFIZJE",
  authDomain: "esp32-tracker-8d016.firebaseapp.com",
  databaseURL: "https://esp32-tracker-8d016-default-rtdb.firebaseio.com",
  projectId: "esp32-tracker-8d016",
  storageBucket: "esp32-tracker-8d016.firebasestorage.app",
  messagingSenderId: "704973480507",
  appId: "1:704973480507:web:f87ca76819432cabe7f21e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// --- Leaflet Map Initialization ---
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Marker for current location
var marker = L.marker([0, 0]).addTo(map);

// Polyline (trail) setup
var pathCoords = [];
var polyline = L.polyline(pathCoords, { color: 'blue' }).addTo(map);

// --- Function to fetch and update location ---
function updateLocation() {
  database.ref('/location').once('value').then((snapshot) => {
    var data = snapshot.val();
    if (data) {
      var lat = data.latitude;
      var lng = data.longitude;

      // Update marker position
      marker.setLatLng([lat, lng]);

      // Add point to polyline path
      pathCoords.push([lat, lng]);
      polyline.setLatLngs(pathCoords);

      // Center map to current location
      map.setView([lat, lng], 18);
    }
  });
}

// --- Refresh location every 2.5 seconds ---
setInterval(updateLocation, 2500);
