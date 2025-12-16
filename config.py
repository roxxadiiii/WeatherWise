"""
WeatherWise Configuration
--------------------------
Centralized settings for the weather app. All API keys, timeouts, 
default values, and app behavior are defined here.
"""

import os
from dotenv import load_dotenv

# Load secrets from .env file (API keys, etc.)
load_dotenv()


class Config:
    """All app settings in one place."""
    
    # --- OpenWeatherMap API Settings ---
    # Your API key from openweathermap.org (stored in .env file)
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', '')
    # Base URL for all weather API requests
    OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
    
    # --- Cache Settings ---
    # How long to remember weather data before fetching fresh data (10 minutes)
    CACHE_DURATION = 600  # seconds
    
    # --- Default Location (Gaya, India) ---
    # The app shows this location when first loaded
    DEFAULT_CITY = 'Gaya'
    DEFAULT_COUNTRY = 'IN'
    DEFAULT_LAT = 24.7955  # Latitude
    DEFAULT_LON = 84.9994  # Longitude
    
    # --- API Request Behavior ---
    # How long to wait for OpenWeatherMap to respond before giving up
    REQUEST_TIMEOUT = 10  # seconds
    # How many times to retry if the API call fails
    RETRY_ATTEMPTS = 3
    
    # --- Flask App Settings ---
    # Secret key for session security (change this in production!)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    # Debug mode shows detailed errors (turn off in production)
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # --- Temperature Units ---
    # 'metric' = Celsius, 'imperial' = Fahrenheit
    DEFAULT_UNITS = 'metric'
