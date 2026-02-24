const apiKey = "2379921426f4db010fb155d3a84988ea";
const city = "London";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)
  .then(function(response) {
    const data = response.data;
    document.getElementById("city").textContent = data.name;
    document.getElementById("temperature").textContent = "Temperature: " + data.main.temp + "°C";
    document.getElementById("description").textContent = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  })
  .catch(function(error) {
    document.getElementById("city").textContent = "Error fetching data";
    console.log("Error:", error);
  });