const firebaseUrl = "https://esp32-tracker-8d016-default-rtdb.firebaseio.com/live_data.json";
const targetLocation = { lat: 13.0827, lng: 80.2707 }; // Target location (Chennai coordinates)
let marker, map, path = [];

function initMap() {
  map = L.map("map").setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  marker = L.marker([0, 0]).addTo(map); // initial marker
}

function updateMap() {
  fetch(firebaseUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.lat && data.lon) {
        const lat = data.lat;
        const lon = data.lon;

        // Update marker
        marker.setLatLng([lat, lon]);

        // Update map center
        map.setView([lat, lon], 16);

        // Calculate distance to target
        const distance = calculateDistance(lat, lon, targetLocation.lat, targetLocation.lng);

        // Update HTML with lat, lon, and distance
        document.getElementById("lat").innerText = lat.toFixed(6);
        document.getElementById("lon").innerText = lon.toFixed(6);
        document.getElementById("distance").innerText = distance.toFixed(2);

        // Add to path (show line)
        path.push([lat, lon]);
        L.polyline(path, { color: 'blue' }).addTo(map);
      }
    });
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // returns distance in meters
}

setInterval(updateMap, 3000); // Updates every 3 seconds
initMap(); // Initialize map when the page loads
