// =====================================
// WeatherApp Constructor
// =====================================
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

  this.recentContainer = document.getElementById("recent-searches");
  this.clearBtn = document.getElementById("clear-history");

  this.recentSearches = [];
}

// =====================================
// Initialize App
// =====================================
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  });

  this.clearBtn.addEventListener("click", this.clearHistory.bind(this));

  this.loadRecentSearches();
  this.loadLastCity();
};

// =====================================
// Handle Search
// =====================================
WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name.");
    return;
  }

  this.getWeather(city);
};

// =====================================
// Fetch Weather + Forecast
// =====================================
WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading(true);
  this.error.textContent = "";

  try {
    const weatherURL = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastURL = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    this.displayWeather(weatherData);
    this.displayForecast(this.processForecastData(forecastData.list));

    // Save data
    this.saveRecentSearch(weatherData.name);
    localStorage.setItem("lastCity", weatherData.name);

  } catch (error) {
    this.showError(error.message);
  } finally {
    this.showLoading(false);
  }
};

// =====================================
// Save Recent Search
// =====================================
WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(
    item => item.toLowerCase() !== city.toLowerCase()
  );

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(this.recentSearches)
  );

  this.displayRecentSearches();
};

// =====================================
// Load Recent Searches
// =====================================
WeatherApp.prototype.loadRecentSearches = function () {
  const saved = localStorage.getItem("recentSearches");

  if (saved) {
    this.recentSearches = JSON.parse(saved);
    this.displayRecentSearches();
  }
};

// =====================================
// Display Recent Searches
// =====================================
WeatherApp.prototype.displayRecentSearches = function () {
  this.recentContainer.innerHTML = "";

  this.recentSearches.forEach((city) => {
    const button = document.createElement("button");
    button.textContent = city;
    button.className = "recent-btn";

    button.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentContainer.appendChild(button);
  });
};

// =====================================
// Auto Load Last City
// =====================================
WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    this.getWeather(lastCity);
  }
};

// =====================================
// Clear History
// =====================================
WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");

  this.recentSearches = [];
  this.recentContainer.innerHTML = "";
};

// =====================================
// Display Current Weather
// =====================================
WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <div class="weather-card">
      <h2>${data.name}</h2>
      <p class="temp">${data.main.temp}°C</p>
      <p>${data.weather[0].description}</p>
    </div>
  `;
};

// =====================================
// Process 5-Day Forecast
// =====================================
WeatherApp.prototype.processForecastData = function (list) {
  return list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);
};

// =====================================
// Display Forecast
// =====================================
WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";

  data.forEach(item => {
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h4>${day}</h4>
        <p>${item.main.temp}°C</p>
      </div>
    `;
  });
};

// =====================================
WeatherApp.prototype.showLoading = function (isLoading) {
  this.loading.style.display = isLoading ? "block" : "none";
};

WeatherApp.prototype.showError = function (message) {
  this.error.textContent = message;
  this.weatherContainer.innerHTML = "";
  this.forecastContainer.innerHTML = "";
};

// =====================================
const app = new WeatherApp();
app.init();