const firebaseUrl = "https://esp32-tracker-8d016-default-rtdb.firebaseio.com/location.json";

let map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let marker = L.marker([0, 0]).addTo(map);

function updateMap() {
  fetch(firebaseUrl)
    .then(res => res.json())
    .then(data => {
      if (data.latitude && data.longitude) {
        const lat = data.latitude;
        const lng = data.longitude;

        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 16);
      }
    });
}

setInterval(updateMap, 3000); // Updates every 3 seconds
