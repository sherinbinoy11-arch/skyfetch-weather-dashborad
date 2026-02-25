// ===============================
// WeatherApp Constructor
// ===============================
function WeatherApp() {
  this.apiKey = "YOUR_API_KEY";
  this.baseUrl = "https://api.openweathermap.org/data/2.5";

  // DOM Elements
  this.searchInput = document.getElementById("search-input");
  this.searchBtn = document.getElementById("search-btn");
  this.weatherContainer = document.getElementById("weather-container");
  this.forecastContainer = document.getElementById("forecast-container");
  this.loading = document.getElementById("loading");
  this.error = document.getElementById("error");
}

// ===============================
// Initialize App
// ===============================
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  });

  this.showWelcome();
};

// ===============================
// Welcome Message
// ===============================
WeatherApp.prototype.showWelcome = function () {
  this.weatherContainer.innerHTML =
    "<h2>Search for a city to see weather updates 🌤️</h2>";
  this.forecastContainer.innerHTML = "";
};

// ===============================
// Handle Search
// ===============================
WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name.");
    return;
  }

  this.getWeather(city);
};

// ===============================
// Fetch Weather & Forecast
// ===============================
WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading(true);
  this.error.textContent = "";

  try {
    const weatherURL = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastURL = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL),
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    this.displayWeather(weatherData);

    const processedForecast = this.processForecastData(forecastData.list);
    this.displayForecast(processedForecast);

  } catch (error) {
    this.showError(error.message);
  } finally {
    this.showLoading(false);
  }
};

// ===============================
// Display Current Weather
// ===============================
WeatherApp.prototype.displayWeather = function (data) {
  const cityName = data.name;
  const temperature = data.main.temp;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  this.weatherContainer.innerHTML = `
    <div class="weather-card">
      <h2>${cityName}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
      <p class="temp">${temperature}°C</p>
      <p>${description}</p>
    </div>
  `;
};

// ===============================
// Process 5-Day Forecast
// ===============================
WeatherApp.prototype.processForecastData = function (forecastList) {
  const dailyForecast = forecastList.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  return dailyForecast.slice(0, 5);
};

// ===============================
// Display Forecast Cards
// ===============================
WeatherApp.prototype.displayForecast = function (forecastData) {
  this.forecastContainer.innerHTML = "";

  forecastData.forEach(item => {
    const date = new Date(item.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const temperature = item.main.temp;
    const description = item.weather[0].description;
    const icon = item.weather[0].icon;

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
        <p>${temperature}°C</p>
        <p>${description}</p>
      </div>
    `;
  });
};

// ===============================
// Loading State
// ===============================
WeatherApp.prototype.showLoading = function (isLoading) {
  this.loading.style.display = isLoading ? "block" : "none";
};

// ===============================
// Show Error
// ===============================
WeatherApp.prototype.showError = function (message) {
  this.error.textContent = message;
  this.weatherContainer.innerHTML = "";
  this.forecastContainer.innerHTML = "";
};

// ===============================
// Start Application
// ===============================
const app = new WeatherApp();
app.init();