"""
WeatherWise - Flask Weather Application
-----------------------------------------
A real-time weather dashboard that fetches data from OpenWeatherMap API.
Features supports both city names and GPS coordinates.

Authors: Aditya Kumar & Ashif Rahman
License: GPL-3.0
"""

# Standard library imports
from datetime import datetime, timedelta
import logging

# Third-party imports
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests

# Local imports
from config import Config

# Set up logging to track API calls and errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app and load settings from config.py
app = Flask(__name__)
app.config.from_object(Config)
# Enable CORS so frontend JavaScript can access our API
CORS(app)

# In-memory cache to avoid hammering the OpenWeatherMap API
# Stores weather data temporarily (10 minutes by default)
cache = {}


def is_cache_valid(cache_key):
    #Check if cached data is still fresh (not expired.
    if cache_key not in cache:
        return False
    
    cached_time = cache[cache_key].get('timestamp')
    if not cached_time:
        return False
    
    # Calculate how old the cached data is
    time_diff = datetime.now() - cached_time
    return time_diff.total_seconds() < Config.CACHE_DURATION


def get_cached_data(cache_key):
    # Get weather data from cache if it's still fresh.
    if is_cache_valid(cache_key):
        logger.info(f"Cached data for {cache_key}")
        return cache[cache_key]['data']
    return None


def set_cache_data(cache_key, data):
    # Save weather data to cache with a timestamp.
    cache[cache_key] = {
        'data': data,
        'timestamp': datetime.now()  # Remember when we cached this
    }
    logger.info(f"Cached data for {cache_key}")


def fetch_weather_data(endpoint, params):
    """
    Fetch weather data from OpenWeatherMap API with retry logic.
    
    Args:
        endpoint: 'weather' for current weather, 'forecast' for 5-day forecast
        params: Search parameters (city name or lat/lon coordinates)
    
    Returns:
        Weather data as JSON, or None if all attempts fail
    """
    # Make sure we have an API key before trying to call the API
    if not Config.OPENWEATHER_API_KEY:
        logger.error("OpenWeatherMap API key not configured")
        return None
    
    # Add API key to request parameters
    params['appid'] = Config.OPENWEATHER_API_KEY
    url = f"{Config.OPENWEATHER_BASE_URL}/{endpoint}"
    
    # Try up to 3 times in case of network issues
    for attempt in range(Config.RETRY_ATTEMPTS):
        try:
            response = requests.get(
                url,
                params=params,
                timeout=Config.REQUEST_TIMEOUT  # Don't wait forever
            )
            response.raise_for_status()  # Raise error for bad status codes (4xx, 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
            # If this was our last attempt, give up
            if attempt == Config.RETRY_ATTEMPTS - 1:
                logger.error(f"Failed to fetch weather data after {Config.RETRY_ATTEMPTS} attempts")
                return None
    
    return None


# --- Web Routes ---

@app.route('/')
def index():
    """Serve the main weather dashboard page."""
    return render_template('index.html')


# --- API Endpoints ---

@app.route('/api/weather/current')
def get_current_weather():
    """
    API endpoint for current weather conditions.
    
    Query Parameters:
        - city: City name (e.g., "Delhi") OR
        - lat & lon: GPS coordinates (e.g., lat=24.8012&lon=84.0816)
        - units: 'metric' (Celsius) or 'imperial' (Fahrenheit)
    
    Returns:
        JSON with temperature, humidity, wind speed, etc.
    """
    # Get search parameters from URL query string
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    units = request.args.get('units', Config.DEFAULT_UNITS)
    
    # Build cache key and API parameters based on search type
    if city:
        cache_key = f"current_{city}_{units}"
        params = {'q': city, 'units': units}
    elif lat and lon:
        cache_key = f"current_{lat}_{lon}_{units}"
        params = {'lat': lat, 'lon': lon, 'units': units}
    else:
        return jsonify({'error': 'City name or coordinates required'}), 400
    
    # Try to get data from cache first (faster!)
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Cache miss - fetch fresh data from OpenWeatherMap
    data = fetch_weather_data('weather', params)
    
    if data:
        set_cache_data(cache_key, data)  # Save for next time
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch weather data'}), 500


@app.route('/api/weather/forecast')
def get_forecast():
    """
    API endpoint for 5-day weather forecast.
    
    Query Parameters:
        - city: City name (e.g., "Delhi") OR
        - lat & lon: GPS coordinates
        - units: 'metric' or 'imperial'
    
    Returns:
        JSON with forecast data (temperature, conditions every 3 hours)
    """
    # Get search parameters from URL
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    units = request.args.get('units', Config.DEFAULT_UNITS)
    
    # Build cache key and API parameters
    if city:
        cache_key = f"forecast_{city}_{units}"
        params = {'q': city, 'units': units}
    elif lat and lon:
        cache_key = f"forecast_{lat}_{lon}_{units}"
        params = {'lat': lat, 'lon': lon, 'units': units}
    else:
        return jsonify({'error': 'City name or coordinates required'}), 400
    
    # Check cache first
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Fetch fresh forecast data from API
    data = fetch_weather_data('forecast', params)
    
    if data:
        set_cache_data(cache_key, data)
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch forecast data'}), 500


@app.route('/api/config')
def get_config():
    """
    Send app configuration to the frontend.
    Used to set default location and units when the page loads.
    
    Returns:
        JSON with default city, coordinates, and temperature units
    """
    return jsonify({
        'defaultCity': Config.DEFAULT_CITY,
        'defaultCountry': Config.DEFAULT_COUNTRY,
        'defaultLat': Config.DEFAULT_LAT,
        'defaultLon': Config.DEFAULT_LON,
        'defaultUnits': Config.DEFAULT_UNITS,
        'cacheDuration': Config.CACHE_DURATION
    })


# --- Error Handlers ---

@app.errorhandler(404)
def not_found(error):
    """Handle 404 Not Found errors (invalid URLs)."""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 Internal Server errors (something broke)."""
    return jsonify({'error': 'Internal server error'}), 500


# --- App Startup ---

if __name__ == '__main__':
    # Warn if API key is missing
    if not Config.OPENWEATHER_API_KEY:
        logger.warning("=" * 60)
        logger.warning("WARNING: OPENWEATHER_API_KEY not set!")
        logger.warning("Please create a .env file with your API key.")
        logger.warning("See .env.example for reference.")
        logger.warning("=" * 60)
    
    # Start the Flask development server
    # host='0.0.0.0' makes it accessible from other devices on your network
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)
