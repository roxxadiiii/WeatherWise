/**
 * WeatherWise - Frontend JavaScript
 * Handles API calls, UI updates, charts, and user interactions
 */

// App state - tracks current settings
let currentUnits = 'metric'; // 'metric' = Celsius, 'imperial' = Fahrenheit
let currentCity = '';
let currentLat = null;
let currentLon = null;
let temperatureChart = null; // Chart.js instance
let humidityChart = null;    // Chart.js instance

// Grab all DOM elements we'll need
const loadingOverlay = document.getElementById('loadingOverlay');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const refreshBtn = document.getElementById('refreshBtn');
const unitToggle = document.getElementById('unitToggle');
const unitLabel = document.getElementById('unitLabel');
const errorClose = document.getElementById('errorClose');

// Start the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadPreferences();
});

// Initialize app - try GPS, fallback to default city
async function initializeApp() {
    showLoading();

    // Try to get user's GPS location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                fetchWeatherData();
            },
            async (error) => {
                console.warn('Geolocation denied:', error);
                // User denied location - use default city instead
                await loadDefaultLocation();
            }
        );
    } else {
        await loadDefaultLocation();
    }
}

// Load default location from backend config
async function loadDefaultLocation() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        currentLat = config.defaultLat;
        currentLon = config.defaultLon;
        currentCity = config.defaultCity;
        fetchWeatherData();
    } catch (error) {
        showError('Failed to load default location');
        hideLoading();
    }
}

// Wire up all button clicks and key presses
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    // Allow Enter key to search
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    locationBtn.addEventListener('click', handleLocationRequest);
    refreshBtn.addEventListener('click', () => fetchWeatherData());
    unitToggle.addEventListener('click', handleUnitToggle);
    errorClose.addEventListener('click', hideError);
}

// Search for weather by city name
function handleSearch() {
    const city = citySearch.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    currentCity = city;
    currentLat = null;
    currentLon = null;
    fetchWeatherData();
}

// Use GPS button clicked
function handleLocationRequest() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLat = position.coords.latitude;
            currentLon = position.coords.longitude;
            currentCity = '';
            fetchWeatherData();
        },
        (error) => {
            hideLoading();
            showError('Unable to get your location. Please search for a city.');
        }
    );
}

// Toggle between Celsius and Fahrenheit
function handleUnitToggle() {
    currentUnits = currentUnits === 'metric' ? 'imperial' : 'metric';
    unitLabel.textContent = currentUnits === 'metric' ? '°C' : '°F';

    // Update all temperature units on page
    const tempUnits = document.querySelectorAll('.temp-unit');
    tempUnits.forEach(unit => {
        unit.textContent = currentUnits === 'metric' ? '°C' : '°F';
    });

    savePreferences();
    fetchWeatherData();
}

// Fetch weather data from Flask backend
async function fetchWeatherData() {
    showLoading();
    hideError();

    try {
        // Build query parameters
        const params = new URLSearchParams({ units: currentUnits });
        if (currentCity) {
            params.append('city', currentCity);
        } else if (currentLat && currentLon) {
            params.append('lat', currentLat);
            params.append('lon', currentLon);
        }

        // Fetch current weather and forecast in parallel for speed
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`/api/weather/current?${params}`),
            fetch(`/api/weather/forecast?${params}`)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        if (currentData.error || forecastData.error) {
            throw new Error(currentData.error || forecastData.error);
        }

        updateCurrentWeather(currentData);
        updateForecast(forecastData);
        updateCharts(forecastData);

        hideLoading();
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
        hideLoading();
    }
}

// Update the main weather display with current conditions
function updateCurrentWeather(data) {
    // Location
    document.getElementById('cityText').textContent = `${data.name}, ${data.sys.country}`;

    // Weather description
    document.getElementById('weatherDescription').textContent = data.weather[0].description;

    // Temperature
    document.getElementById('currentTemp').textContent = Math.round(data.main.temp);
    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);

    // Weather icon
    updateWeatherIcon('weatherIconLarge', data.weather[0].main);

    // Details
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = formatWindSpeed(data.wind.speed);
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Sun times
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset);

    // Last updated
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();

    // Save current city to preferences
    if (data.name) {
        currentCity = data.name;
        savePreferences();
    }
}

// Update the 5-day forecast cards
function updateForecast(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';

    // Get one forecast per day (around noon)
    const dailyForecasts = getDailyForecasts(data.list);

    dailyForecasts.forEach(forecast => {
        const card = createForecastCard(forecast);
        forecastCards.appendChild(card);
    });
}

// Filter forecast data to get one entry per day (around noon)
function getDailyForecasts(forecastList) {
    const dailyMap = new Map();

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateKey = date.toDateString();

        // Get forecast around noon (12:00) for best representation
        const hour = date.getHours();
        if (!dailyMap.has(dateKey) || Math.abs(hour - 12) < Math.abs(dailyMap.get(dateKey).hour - 12)) {
            dailyMap.set(dateKey, { ...forecast, hour });
        }
    });

    return Array.from(dailyMap.values()).slice(0, 5);
}

// Create a forecast card HTML element
function createForecastCard(forecast) {
    const card = document.createElement('div');
    card.className = 'forecast-card';

    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const iconHtml = getWeatherIconHtml(forecast.weather[0].main);
    const tempUnit = currentUnits === 'metric' ? '°C' : '°F';

    card.innerHTML = `
        <div class="forecast-date">${dayName}, ${dateStr}</div>
        <div class="forecast-icon">${iconHtml}</div>
        <div class="forecast-temp">${Math.round(forecast.main.temp)}${tempUnit}</div>
        <div class="forecast-description">${forecast.weather[0].description}</div>
        <div class="forecast-details">
            <div class="forecast-detail">
                <span class="material-icons">water_drop</span>
                <span>${forecast.main.humidity}%</span>
            </div>
            <div class="forecast-detail">
                <span class="material-icons">air</span>
                <span>${Math.round(forecast.wind.speed)} ${currentUnits === 'metric' ? 'm/s' : 'mph'}</span>
            </div>
        </div>
    `;

    return card;
}

// Create temperature and humidity charts using Chart.js
function updateCharts(data) {
    const labels = [];
    const temperatures = [];
    const humidity = [];

    // Get data for next 24 hours (8 points × 3-hour intervals)
    data.list.slice(0, 8).forEach(item => {
        const date = new Date(item.dt * 1000);
        labels.push(date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
        temperatures.push(Math.round(item.main.temp));
        humidity.push(item.main.humidity);
    });

    // Temperature Chart
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    // Destroy old chart if it exists
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${currentUnits === 'metric' ? '°C' : '°F'})`,
                data: temperatures,
                borderColor: '#ffb86c',
                backgroundColor: 'rgba(255, 184, 108, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#ffb86c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: getChartOptions('Temperature')
    });

    // Humidity Chart
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    // Destroy old chart if it exists
    if (humidityChart) {
        humidityChart.destroy();
    }

    humidityChart = new Chart(humidityCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidity,
                backgroundColor: 'rgba(139, 233, 253, 0.6)',
                borderColor: '#8be9fd',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: getChartOptions('Humidity')
    });
}

// Chart.js configuration (colors, tooltips, grid)
function getChartOptions(label) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(68, 71, 90, 0.95)',
                titleColor: '#f8f8f2',
                bodyColor: '#f8f8f2',
                borderColor: '#bd93f9',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(98, 114, 164, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6272a4',
                    font: { size: 11 }
                }
            },
            y: {
                grid: {
                    color: 'rgba(98, 114, 164, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6272a4',
                    font: { size: 11 }
                }
            }
        }
    };
}

// Update weather icon based on condition (sunny, cloudy, rainy, etc.)
function updateWeatherIcon(elementId, condition) {
    const element = document.getElementById(elementId);
    const iconHtml = getWeatherIconHtml(condition);
    element.innerHTML = iconHtml;
}

// Map weather conditions to Material Icons
function getWeatherIconHtml(condition) {
    const iconMap = {
        'Clear': '<span class="material-icons">wb_sunny</span>',
        'Clouds': '<span class="material-icons">cloud</span>',
        'Rain': '<span class="material-icons">rainy</span>',
        'Drizzle': '<span class="material-icons">grain</span>',
        'Thunderstorm': '<span class="material-icons">thunderstorm</span>',
        'Snow': '<span class="material-icons">ac_unit</span>',
        'Mist': '<span class="material-icons">foggy</span>',
        'Fog': '<span class="material-icons">foggy</span>',
        'Haze': '<span class="material-icons">foggy</span>'
    };

    return iconMap[condition] || '<span class="material-icons">wb_sunny</span>';
}

// Format wind speed with correct unit (m/s or mph)
function formatWindSpeed(speed) {
    const unit = currentUnits === 'metric' ? 'm/s' : 'mph';
    return `${Math.round(speed)} ${unit}`;
}

// Convert Unix timestamp to readable time (e.g., "6:30 AM")
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Show loading spinner
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Display error message to user
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Save user's preferred units and last city to browser
function savePreferences() {
    const preferences = {
        units: currentUnits,
        lastCity: currentCity
    };
    localStorage.setItem('weatherWisePrefs', JSON.stringify(preferences));
}

// Load saved preferences from browser storage
function loadPreferences() {
    const saved = localStorage.getItem('weatherWisePrefs');
    if (saved) {
        try {
            const preferences = JSON.parse(saved);
            if (preferences.units) {
                currentUnits = preferences.units;
                unitLabel.textContent = currentUnits === 'metric' ? '°C' : '°F';
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }
}

// Auto-refresh every 15 minutes (only if tab is visible)
setInterval(() => {
    if (!document.hidden) { // Don't refresh if tab is in background
        fetchWeatherData();
    }
}, 15 * 60 * 1000); // 15 minutes in milliseconds
