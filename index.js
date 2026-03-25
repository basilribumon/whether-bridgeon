const API_KEY = 'YOUR_API_KEY_HERE';
const body = document.body;
const themeBtn = document.getElementById('theme-toggle');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const loader = document.getElementById('loader');
const weatherContent = document.getElementById('weather-content');
const errorMsg = document.getElementById('error-msg');
const favList = document.getElementById('fav-list');

let favorites = JSON.parse(localStorage.getItem('weatherFavs')) || [];

// 1. Theme Toggle
themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    themeBtn.innerText = body.classList.contains('light-theme') ? '🌙 Dark Mode' : '☀️ Light Mode';
});

// 2. Fetch Weather
async function fetchWeather(city) {
  if (!city) return;

  try {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    let data = await res.json();

    updateUI(data);
  } catch (err) {
    console.log("Error fetching data");
  }
}

function updateUI(data) {
  document.getElementById('city-name').innerText = data.city.name;
  document.getElementById('curr-temp').innerText = Math.round(data.list[0].main.temp) + "°C";
  document.getElementById('curr-desc').innerText = data.list[0].weather[0].description;

  let container = document.getElementById('forecast-container');
  container.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    let day = data.list[i];
    let date = new Date(day.dt_txt).toLocaleDateString('en', { weekday: 'short' });

    container.innerHTML += `
      <div>
        <p>${date}</p>
        <p>${Math.round(day.main.temp)}°</p>
      </div>
    `;
  }
}
// 3. Favorites Logic
function addFavorite(city) {
    if (!favorites.includes(city)) {
        favorites.push(city);
        saveAndRender();
    }
}

function removeFavorite(city) {
    favorites = favorites.filter(c => c !== city);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('weatherFavs', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    favList.innerHTML = '';
    if (favorites.length === 0) {
        favList.innerHTML = '<p id="no-fav-text">No favorites added yet.</p>';
        return;
    }
    favorites.forEach(city => {
        const tag = document.createElement('div');
        tag.className = 'fav-tag';
        tag.innerHTML = `
            <span style="cursor:pointer">${city}</span>
            <span style="cursor:pointer; font-weight:bold" onclick="removeFavorite('${city}')">×</span>
        `;
        tag.querySelector('span').onclick = () => fetchWeather(city);
        favList.appendChild(tag);
    });
}

searchBtn.addEventListener('click', () => fetchWeather(cityInput.value));
renderFavorites(); // Load on refresh