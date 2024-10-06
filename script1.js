const apiKey = "f32a88dccabe4e3aa3762023240510"; // Replace with your actual API key
const searchButton = document.getElementById("searchButton");
const cityInput = document.getElementById("cityInput");
const currentWeather = document.getElementById("currentWeather");
const forecastWeather = document.getElementById("forecastWeather");

searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    fetchWeatherForecast(city, 7); // Fetch 7-day forecast
  }
});

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );
    const data = await response.json();

    if (data.error) {
      currentWeather.innerHTML = `<p>${data.error.message}</p>`;
    } else {
      displayCurrentWeather(data);
    }
  } catch (error) {
    currentWeather.innerHTML = `<p>Error fetching current weather data!</p>`;
    console.error(error);
  }
}

async function fetchWeatherForecast(city, days) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}`
    );
    const data = await response.json();

    if (data.error) {
      forecastWeather.innerHTML = `<p>${data.error.message}</p>`;
    } else {
      displayWeatherForecast(data);
    }
  } catch (error) {
    forecastWeather.innerHTML = `<p>Error fetching forecast data!</p>`;
    console.error(error);
  }
}

function displayCurrentWeather(data) {
  const { location, current } = data;
  currentWeather.innerHTML = `
        <h2>Current Weather in ${location.name}, ${location.country}</h2>
        <p>Temperature: ${current.temp_c} °C</p>
        <p>Feels Like: ${current.feelslike_c} °C</p>
        <p>Humidity: ${current.humidity} %</p>
        <p>Wind Speed: ${current.wind_kph} kph</p>
        <p>Condition: ${current.condition.text}</p>
        <img src="${current.condition.icon}" alt="Weather icon">
    `;
}

function displayWeatherForecast(data) {
  const { location, forecast } = data;
  let forecastHTML = `<h2>7-Day Forecast for ${location.name}, ${location.country}</h2>`;

  // Arrays to hold data for the chart
  const labels = [];
  const temperatures = [];
  const humidities = [];

  forecast.forecastday.forEach((day) => {
    forecastHTML += `
            <div class="forecast">
                <h3>${day.date}</h3>
                <p>Average Temperature: ${day.day.avgtemp_c} °C</p>
                <p>Humidity: ${day.day.avghumidity} %</p>
                <p>Condition: ${day.day.condition.text}</p>
                <p>Wind Speed: ${day.day.maxwind_kph} kph</p>
                <img src="${day.day.condition.icon}" alt="Weather icon">
            </div>
        `;

    // Push date, temperature, and humidity to arrays
    labels.push(day.date);
    temperatures.push(day.day.avgtemp_c);
    humidities.push(day.day.avghumidity);
  });

  forecastWeather.innerHTML = forecastHTML;

  // Create the chart
  const ctx = document.getElementById("temperatureChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Average Temperature (°C)",
          data: temperatures,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
        },
        {
          label: "Average Humidity (%)",
          data: humidities,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Value",
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  });
}
