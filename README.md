# WeatherWise 🌦️

<div align="center">

![WeatherWise Banner](https://img.shields.io/badge/WeatherWise-Real--Time%20Forecast-blueviolet?style=for-the-badge)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)
[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg?style=for-the-badge)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg?style=for-the-badge)](https://flask.palletsprojects.com/)

**A beautiful, real-time weather forecast dashboard with interactive charts and modern glassmorphism design.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Setup](#-api-setup) • [Documentation](#-documentation)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
  - [Prerequisites](#prerequisites)
  - [Arch Linux Setup](#arch-linux-setup)
  - [Other Linux Distributions](#other-linux-distributions)
  - [macOS Setup](#macos-setup)
  - [Windows Setup](#windows-setup)
- [API Setup](#-api-setup)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)

---

## 🌟 Overview

WeatherWise is a modern, full-stack web application that provides real-time weather information with a beautiful user interface. Built with Flask (Python) backend and vanilla JavaScript frontend, it features:

- **Real-time weather data** from OpenWeatherMap API
- **Interactive charts** using Chart.js for temperature and humidity trends
- **Glassmorphism UI** with Dracula dark theme
- **Smart caching** to reduce API calls and improve performance
- **Responsive design** that works on desktop, tablet, and mobile
- **GPS location support** with fallback to manual city search

---

## ✨ Features

### 🌍 **Location Services**
- Automatic GPS-based location detection
- Manual city search with validation
- Remembers last searched location
- Default location fallback (Gaya, India)

### 🌡️ **Weather Information**
- Current temperature and "feels like" temperature
- Weather conditions with dynamic icons
- Humidity, wind speed, and atmospheric pressure
- Visibility and air quality metrics
- Sunrise and sunset times
- Last updated timestamp

### 📊 **Data Visualization**
- Interactive temperature trend chart (24-hour forecast)
- Humidity bar chart with hover tooltips
- 5-day weather forecast with daily cards
- Smooth animations and transitions

### 🎨 **User Experience**
- Modern glassmorphism design
- Dracula color palette (easy on the eyes)
- Toggle between Celsius and Fahrenheit
- Toggle between metric and imperial units
- Loading states and error handling
- Auto-refresh every 15 minutes

### ⚡ **Performance**
- 10-minute smart caching system
- Retry logic for failed API requests (3 attempts)
- Parallel API calls for faster loading
- LocalStorage for user preferences
- Optimized for low bandwidth

---

## 📸 Screenshots

> **Note:** Add screenshots of your application here

```
[Main Dashboard]  [Interactive Charts]  [5-Day Forecast]
```

---

## 🛠️ Technology Stack

### **Frontend**
- HTML5 - Structure and semantics
- CSS3 - Styling with glassmorphism effects
- JavaScript (ES6+) - Interactive functionality
- Chart.js 4.4.0 - Data visualization
- Material Icons - UI icons
- Google Fonts (JetBrains Mono) - Typography

### **Backend**
- Python 3.13 - Programming language
- Flask 3.0.0 - Web framework
- Flask-CORS 4.0.0 - Cross-origin resource sharing
- Requests 2.31.0 - HTTP library
- Python-dotenv 1.0.0 - Environment variable management

### **External Services**
- OpenWeatherMap API v2.5 - Weather data provider

### **Development Tools**
- Git - Version control
- GitHub - Code hosting
- VS Code - Code editor

---

## 📦 Installation

### Prerequisites

Before installing WeatherWise, ensure you have the following:

- **Python 3.13 or higher**
- **pip** (Python package manager)
- **Git** (for cloning the repository)
- **OpenWeatherMap API Key** (free tier available)

---

### Arch Linux Setup

#### 1. **Install System Dependencies**

```bash
# Update system packages
sudo pacman -Syu

# Install Python and pip
sudo pacman -S python python-pip

# Install Git (if not already installed)
sudo pacman -S git

# Optional: Install pipx for isolated Python tools
sudo pacman -S python-pipx
```

#### 2. **Clone the Repository**

```bash
# Clone from GitHub
git clone https://github.com/roxxadiiii/WeatherWise.git

# Navigate to project directory
cd WeatherWise
```

#### 3. **Create Virtual Environment**

```bash
# Create a virtual environment
python -m venv .venv

# Activate virtual environment (Fish shell)
source .venv/bin/activate.fish

# For Bash/Zsh users:
# source .venv/bin/activate
```

#### 4. **Install Python Dependencies**

```bash
# Upgrade pip to latest version
pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt
```

**What gets installed:**
- `Flask==3.0.0` - Web framework
- `requests==2.31.0` - HTTP library for API calls
- `python-dotenv==1.0.0` - Environment variable loader
- `flask-cors==4.0.0` - CORS handling
- `Werkzeug==3.0.1` - WSGI utility library

#### 5. **Verify Installation**

```bash
# Check Python version
python --version
# Output: Python 3.13.x

# Check installed packages
pip list
# Should show Flask, requests, flask-cors, etc.
```

---

### Other Linux Distributions

#### **Debian/Ubuntu**

```bash
# Update package list
sudo apt update

# Install Python and pip
sudo apt install python3 python3-pip python3-venv git

# Clone and setup (same as Arch)
git clone https://github.com/roxxadiiii/WeatherWise.git
cd WeatherWise
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### **Fedora/RHEL**

```bash
# Install Python and pip
sudo dnf install python3 python3-pip git

# Clone and setup (same as Arch)
git clone https://github.com/roxxadiiii/WeatherWise.git
cd WeatherWise
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### macOS Setup

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python

# Clone and setup
git clone https://github.com/roxxadiiii/WeatherWise.git
cd WeatherWise
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### Windows Setup

```powershell
# Install Python from python.org (ensure "Add to PATH" is checked)

# Clone repository
git clone https://github.com/roxxadiiii/WeatherWise.git
cd WeatherWise

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## 🔑 API Setup

### 1. **Get OpenWeatherMap API Key**

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Navigate to "API keys" section
4. Copy your API key (or generate a new one)
5. **Wait 10 minutes to 2 hours** for the key to activate

### 2. **Configure Environment Variables**

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env

# Edit with your favorite editor
nano .env
# or
vim .env
```

Add the following content:

```env
# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_api_key_here

# Flask Configuration (optional)
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
```

**Important:** Replace `your_api_key_here` with your actual API key!

### 3. **Verify API Key**

```bash
# Test API key with curl
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY"

# Should return JSON weather data
```

---

## ⚙️ Configuration

### Default Settings

Edit `config.py` to customize default settings:

```python
# Default Location (change to your city)
DEFAULT_CITY = 'Gaya'
DEFAULT_COUNTRY = 'IN'
DEFAULT_LAT = 24.7955
DEFAULT_LON = 84.9994

# Cache Duration (in seconds)
CACHE_DURATION = 600  # 10 minutes

# API Request Settings
REQUEST_TIMEOUT = 10  # seconds
RETRY_ATTEMPTS = 3

# Temperature Units
DEFAULT_UNITS = 'metric'  # 'metric' or 'imperial'
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | Required |
| `SECRET_KEY` | Flask secret key for sessions | `dev-secret-key-change-in-production` |
| `DEBUG` | Enable debug mode | `True` |

---

## 🚀 Usage

### Starting the Application

#### **Method 1: Using Python directly**

```bash
# Activate virtual environment
source .venv/bin/activate.fish  # Fish shell
# or
source .venv/bin/activate       # Bash/Zsh

# Run the Flask application
python app.py
```

#### **Method 2: Using Flask CLI**

```bash
# Set Flask app
export FLASK_APP=app.py

# Run in development mode
flask run

# Run on specific host and port
flask run --host=0.0.0.0 --port=5000
```

#### **Method 3: Using gunicorn (Production)**

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Accessing the Application

Once started, open your browser and navigate to:

```
http://localhost:5000
```

Or from another device on the same network:

```
http://YOUR_LOCAL_IP:5000
```

### Using the Application

#### **1. View Current Weather**
- The app automatically detects your location (if GPS is enabled)
- Current weather displays immediately on page load

#### **2. Search for a City**
```
1. Type city name in search bar (e.g., "Delhi", "New York")
2. Press Enter or click Search button
3. Weather updates automatically
```

#### **3. Use GPS Location**
```
1. Click the location icon (📍) in the header
2. Allow browser location access when prompted
3. Weather updates to your current location
```

#### **4. Toggle Temperature Units**
```
1. Click the thermometer icon (🌡️) in the header
2. Switches between Celsius (°C) and Fahrenheit (°F)
3. Preference is saved in browser
```

#### **5. Refresh Data**
```
1. Click the refresh icon (🔄) in the header
2. Fetches latest weather data
3. Updates all displays and charts
```

#### **6. View Charts**
- Scroll down to see temperature and humidity charts
- Hover over data points for detailed information
- Charts show 24-hour forecast (8 data points)

#### **7. Check 5-Day Forecast**
- Scroll to bottom section
- View daily forecast cards
- Each card shows temperature, conditions, humidity, and wind

---

## 📂 Project Structure

```
WeatherWise/
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (create this)
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── LICENSE                     # GPL-3.0 license
├── ToRemember.md              # Study notes for beginners
├── scripts.md                  # Presentation script
│
├── templates/                  # HTML templates
│   └── index.html             # Main dashboard page
│
├── static/                     # Static assets
│   ├── css/
│   │   └── style.css          # Styles and animations
│   └── js/
│       └── app.js             # Frontend JavaScript
│
└── __pycache__/               # Python cache (auto-generated)
```

---

## 🔌 API Endpoints

### **GET /**
Returns the main dashboard HTML page.

**Response:** HTML page

---

### **GET /api/config**
Returns application configuration for frontend.

**Response:**
```json
{
  "defaultCity": "Gaya",
  "defaultCountry": "IN",
  "defaultLat": 24.7955,
  "defaultLon": 84.9994,
  "defaultUnits": "metric",
  "cacheDuration": 600
}
```

---

### **GET /api/weather/current**
Get current weather for a location.

**Query Parameters:**
- `city` (optional) - City name (e.g., "Delhi")
- `lat` (optional) - Latitude coordinate
- `lon` (optional) - Longitude coordinate
- `units` (optional) - "metric" or "imperial" (default: "metric")

**Example:**
```bash
# By city name
curl "http://localhost:5000/api/weather/current?city=Delhi&units=metric"

# By coordinates
curl "http://localhost:5000/api/weather/current?lat=28.6139&lon=77.2090&units=metric"
```

**Response:**
```json
{
  "name": "Delhi",
  "sys": { "country": "IN" },
  "main": {
    "temp": 25.5,
    "feels_like": 24.8,
    "humidity": 60,
    "pressure": 1013
  },
  "weather": [
    { "main": "Clear", "description": "clear sky" }
  ],
  "wind": { "speed": 3.5 },
  "visibility": 10000
}
```

---

### **GET /api/weather/forecast**
Get 5-day weather forecast.

**Query Parameters:** (same as current weather)

**Example:**
```bash
curl "http://localhost:5000/api/weather/forecast?city=Delhi&units=metric"
```

**Response:**
```json
{
  "list": [
    {
      "dt": 1702742400,
      "main": { "temp": 26.2, "humidity": 55 },
      "weather": [{ "main": "Clouds", "description": "few clouds" }],
      "wind": { "speed": 2.8 }
    }
    // ... more forecast data
  ]
}
```

---

## 🔧 Development

### Running in Development Mode

```bash
# Activate virtual environment
source .venv/bin/activate.fish

# Set debug mode
export FLASK_DEBUG=1

# Run Flask
python app.py
```

### Code Style

This project follows:
- **PEP 8** for Python code
- **ESLint** recommendations for JavaScript
- **BEM methodology** for CSS class naming

### Making Changes

1. **Backend changes** - Edit `app.py` or `config.py`
2. **Frontend HTML** - Edit `templates/index.html`
3. **Frontend CSS** - Edit `static/css/style.css`
4. **Frontend JS** - Edit `static/js/app.js`

The Flask development server auto-reloads on file changes!

### Testing

```bash
# Test API endpoints
curl http://localhost:5000/api/config
curl "http://localhost:5000/api/weather/current?city=Delhi"

# Check logs
# Flask prints logs to console
```

---

## 🐛 Troubleshooting

### **Issue: "ModuleNotFoundError: No module named 'flask'"**

**Solution:**
```bash
# Make sure virtual environment is activated
source .venv/bin/activate.fish

# Reinstall dependencies
pip install -r requirements.txt
```

---

### **Issue: "401 Unauthorized" API Error**

**Causes:**
1. Invalid API key
2. API key not activated yet (wait 10 min - 2 hours)
3. API key missing from `.env` file

**Solution:**
```bash
# Check .env file exists and has correct key
cat .env

# Test API key directly
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"

# Wait if key is new (up to 2 hours)
```

---

### **Issue: "Address already in use" Error**

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
python app.py --port 5001
```

---

### **Issue: CORS Errors in Browser Console**

**Solution:**
```bash
# Ensure flask-cors is installed
pip install flask-cors

# Check app.py has CORS enabled
# CORS(app) should be present
```

---

### **Issue: Charts Not Displaying**

**Causes:**
1. Chart.js not loading
2. JavaScript errors
3. No data from API

**Solution:**
```bash
# Check browser console (F12) for errors
# Verify internet connection (Chart.js loads from CDN)
# Check API is returning data
```

---

### **Issue: Virtual Environment Not Activating**

**Fish Shell:**
```bash
source .venv/bin/activate.fish
```

**Bash/Zsh:**
```bash
source .venv/bin/activate
```

**Windows:**
```powershell
.venv\Scripts\activate
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/roxxadiiii/WeatherWise/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, Python version, browser)

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/WeatherWise.git
cd WeatherWise

# Add upstream remote
git remote add upstream https://github.com/roxxadiiii/WeatherWise.git

# Create branch
git checkout -b feature/my-feature

# Make changes, test, commit
git add .
git commit -m "Description of changes"

# Push and create PR
git push origin feature/my-feature
```

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ You can use this code for personal and commercial projects
- ✅ You can modify and distribute the code
- ✅ You must disclose the source code
- ✅ You must use the same GPL-3.0 license
- ✅ You must state changes made to the code

---

## 👥 Authors

**Aditya Kumar & Ashif Rahman**

- GitHub: [@roxxadiiii](https://github.com/roxxadiiii)
- Project Link: [WeatherWise](https://github.com/roxxadiiii/WeatherWise)

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) - Weather data API
- [Chart.js](https://www.chartjs.org/) - Beautiful charts
- [Flask](https://flask.palletsprojects.com/) - Python web framework
- [Material Icons](https://fonts.google.com/icons) - UI icons
- [Dracula Theme](https://draculatheme.com/) - Color palette inspiration
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Monospace font

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/roxxadiiii/WeatherWise/issues)
3. Create a [new issue](https://github.com/roxxadiiii/WeatherWise/issues/new)
4. Read the [study notes](ToRemember.md) for beginners

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Weather alerts and notifications
- [ ] Multiple location bookmarks
- [ ] Light/dark theme toggle
- [ ] Weather maps integration

### Version 2.0 (Future)
- [ ] Historical weather data
- [ ] AI-powered predictions
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)

### Version 3.0 (Long-term)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] User accounts
- [ ] Social sharing features

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Made with ❤️ by Aditya Kumar & Ashif Rahman**

[⬆ Back to Top](#weatherwise-)

</div>