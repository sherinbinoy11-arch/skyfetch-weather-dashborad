const apiKey = "YOUR_API_KEY";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");

/* Show Loading Spinner */
function showLoading() {
  weatherDiv.innerHTML = `<div class="spinner"></div>`;
}

/* Show Error Message */
function showError(message) {
  weatherDiv.innerHTML = `<p class="error">${message}</p>`;
}

/* Display Weather Data */
function displayWeather(data) {
  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>🌥 Condition: ${data.weather[0].description}</p>
    <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

/* Fetch Weather Using Async/Await */
async function getWeather(city) {
  try {
    searchBtn.disabled = true;
    showLoading();

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    displayWeather(response.data);

  } catch (error) {
    showError("City not found. Please try again.");
  } finally {
    searchBtn.disabled = false;
  }
}

/* Button Click Event */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
  cityInput.value = "";
});

/* Enter Key Support */
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});