const API_KEY = 'd64ae7753197722c5947e1ee8246a2e0';
let favorites = JSON.parse(localStorage.getItem('weatherFavs')) || [];

// --- 1. DEBOUNCED SEARCH (500ms) ---
let debounceTimer;
const cityInput = document.getElementById('city-input');

cityInput.addEventListener('input', (e) => {
    const city = e.target.value.trim();
    clearTimeout(debounceTimer);
    
    // Only search if the user enters more than 2 characters
    debounceTimer = setTimeout(() => {
        if (city.length > 2) {
            getWeather(city);
        }
    }, 500); 
});

// --- 2. FETCH API + ASYNC/AWAIT ---
async function getWeather(city) {
    const loader = document.getElementById('loader');
    const content = document.getElementById('weather-content');
    const errorMsg = document.getElementById('error-msg');

    // UI Reset
    loader.classList.remove('hidden');
    content.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("City not found");
        
        const data = await response.json();
        
        // As per your study requirements: Returning the specific data object
        const weatherObj = {
            city: data.name,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        renderWeather(weatherObj);
    } catch (err) {
        errorMsg.innerText = err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// --- 3. UI RENDERING ---
function renderWeather(weather) {
    const content = document.getElementById('weather-content');
    content.classList.remove('hidden');

    document.getElementById('city-name').innerText = weather.city;
    document.getElementById('curr-temp').innerText = `${weather.temp}°C`;
    document.getElementById('curr-desc').innerText = 
        `${weather.description} | Feels like ${weather.feelsLike}°C`;
    
    // Update Add to Favorite Button
    const favBtn = document.getElementById('add-fav-btn');
    favBtn.onclick = () => addFavorite(weather.city);
}

// --- 4. FAVORITES SYSTEM (localStorage) ---
function addFavorite(city) {
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('weatherFavs', JSON.stringify(favorites));
        renderFavoritesList();
    }
}

function renderFavoritesList() {
    const list = document.getElementById('fav-list');
    list.innerHTML = ''; // Clear current list

    if (favorites.length === 0) {
        list.innerHTML = '<p>No favorites added yet.</p>';
        return;
    }

    favorites.forEach(city => {
        const item = document.createElement('div');
        item.className = 'fav-tag';
        item.innerHTML = `
            <span onclick="getWeather('${city}')">${city}</span>
            <button onclick="removeFavorite('${city}')">×</button>
        `;
        list.appendChild(item);
    });
}

window.removeFavorite = (city) => {
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem('weatherFavs', JSON.stringify(favorites));
    renderFavoritesList();
};

// --- 5. THEME TOGGLE ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    document.getElementById('theme-toggle').innerText = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
});

// Load favorites on page refresh
renderFavoritesList();
