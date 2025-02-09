const API_KEY_LOCATIONIQ = "pk.0932e3021694aa36f9c45dc51775cdfb ";
const API_KEY_WEATHER = "f7a4648a0fa24aeba57e5850612f994e";
let map;

async function fetchTravelInfo() {
    const query = document.getElementById("destination-input").value;
    if (!query) return alert("⚠️ Please enter a destination!");

    const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${API_KEY_LOCATIONIQ}&q=${query}&format=json`);
    const data = await response.json();
    
    const placesList = document.getElementById("places-list");
    placesList.innerHTML = "";
    
    if (data.length > 0) {
        showMap(data[0].lat, data[0].lon);
        fetchWeather(query);
        fetchAttractions(query);
    } else {
        placesList.innerHTML = "<li>❌ No results found</li>";
    }
}

async function fetchAttractions(location) {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${location} tourist attractions&format=json&origin=*`);
    const data = await response.json();
    const placesList = document.getElementById("places-list");
    
    placesList.innerHTML = "";
    if (data.query.search.length > 0) {
        data.query.search.slice(0, 5).forEach(place => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="https://en.wikipedia.org/wiki/${place.title}" target="_blank">📍 ${place.title}</a>`;
            placesList.appendChild(listItem);
        });
    } else {
        placesList.innerHTML = "<li>❌ No attractions found</li>";
    }
}

function showMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    L.marker([lat, lon]).addTo(map)
        .bindPopup("Selected Location")
        .openPopup();
}

async function fetchWeather(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY_WEATHER}&units=metric`);
    const data = await response.json();
    document.getElementById("weather-output").innerText = `${data.weather[0].description} ☀️, ${data.main.temp}°C`;
}
