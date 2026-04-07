const API_KEY = 'd64ae7753197722c5947e1ee8246a2e0';

/**
 * Fetch weather data from OpenWeatherMap API
 */
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    return await response.json();
}

/**
 * Search for a city and update the UI
 */
async function searchWeather(city) {
    if (!city) return;

    const card = document.getElementById('weatherCard');
    const error = document.getElementById('errorMsg');
    
    error.style.display = 'none';
    card.style.display = 'block';
    card.innerHTML = "Loading...";

    try {
        const data = await getWeather(city);
        card.innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].main}</p>
            <button class="add-fav-btn" onclick="addFavorite('${data.name}')">⭐ Add to Favorites</button>
        `;
    } catch (err) {
        card.style.display = 'none';
        error.textContent = err.message;
        error.style.display = 'block';
    }
}

/**
 * Add a city to local storage favorites
 */
function addFavorite(city) {
    let favs = JSON.parse(localStorage.getItem('weatherFavs')) || [];
    if (!favs.includes(city)) {
        favs.push(city);
        localStorage.setItem('weatherFavs', JSON.stringify(favs));
        loadFavorites();
    }
}

/**
 * Load favorites from local storage and display buttons
 */
function loadFavorites() {
    const list = document.getElementById('favoritesList');
    const favs = JSON.parse(localStorage.getItem('weatherFavs')) || [];
    
    list.innerHTML = favs.length ? '' : 'No favorites yet.';
    
    favs.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'fav-btn';
        btn.textContent = city;
        btn.onclick = () => searchWeather(city);
        list.appendChild(btn);
    });
}

/**
 * Setup Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    const themeBtn = document.getElementById('themeBtn');

    // Button click search
    searchBtn.onclick = () => searchWeather(cityInput.value);

    // Enter key search
    cityInput.onkeypress = (e) => {
        if (e.key === 'Enter') searchWeather(cityInput.value);
    };

    // Dark Mode Toggle
    themeBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    };

    loadFavorites();
});

// Expose functions to global scope for inline onclick handlers
window.searchWeather = searchWeather;
window.addFavorite = addFavorite;