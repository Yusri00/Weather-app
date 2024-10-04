// document.querySelector('.day-name').textContent = 'Monday';
// document.querySelector('.day-temperature').textContent = '15°C';
// document.querySelector('.day-icon').src = 'assets/sunny.png'; // dynamically change icon based on API data

//Changes background pictures depending on temperature
function changeImage(temperature) {
  const weatherImage = document.getElementById("weather-background");
  const body = document.body;

  const weatherConditions = [
    { minTemperature: 25, src: "sun.jpg" },
    { minTemperature: 18, src: "clear.jpg" },
    { minTemperature: 15, src: "thunder.jpg" },
    { minTemperature: 12, src: "cool.jpg" },
    { minTemperature: 8, src: "rain.jpg" },
    { minTemperature: -Infinity, src: "snow.jpg" }, // Hanterar allt under 8
  ];

  const condition = weatherConditions.find(
    (cond) => temperature >= cond.minTemperature
  );
  weatherImage.src = condition.src;

  // Apply the background image to the body
  body.style.backgroundImage = `url('${condition.src}')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundAttachment = "fixed";
}

//identify current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetchCityName(latitude, longitude);
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error(
          "Error: You need to enable access to your location",
          error
        );
        alert(
          "Unable to retrieve location. Please allow access to your location."
        );
      }
    );
  } else {
    console.error("Geolocation is not supported");
    alert("Geolocation is not supported on your browser");
  }
}

// Find the weather form element
const weatherForm = document.getElementById("weather-form");

// Check if the form exists before adding the event listener
if (weatherForm) {
  weatherForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the city input value
    const cityInput = document.querySelector(".city-input");
    const city = cityInput.value.trim();
    const errorMessage = document.getElementById("error-message");

    // Check if a city was entered
    if (city) {
      // If a valid city is entered, hide any previous error message
      errorMessage.style.display = "none";

      // Call the function to fetch the weather for the entered city
      fetchWeatherForCity(city);
    } else {
      // If no valid city is entered, show an error message
      errorMessage.textContent = "Please enter a valid city name.";
      errorMessage.style.display = "block";
    }
  });
}

//Fetch latitude and longitude using city name (Geocoding API)
function fetchWeatherForCity(city) {
  const geocodingApiKey = "";
  const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${geocodingApiKey}`;

  fetch(geocodingApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch city coordinates.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        const cityName = data[0].name;
        const countryName = data[0].country;

        // Now that we have the coordinates, fetch the weather data
        fetchWeatherData(latitude, longitude, cityName, countryName);
      } else {
        throw new Error("City not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching city coordinates:", error);
      alert("City not found. Please try again.");
    });
}

function fetchCityName(latitude, longitude) {
  const apiKey = "";
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  let city = " ";
  let country = " ";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch city name");
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "OK" && data.results.length > 0) {
        // Extract city and country from the address components
        data.results[0].address_components.forEach((component) => {
          // Check for city (locality) or administrative areas
          if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_1")
          ) {
            city = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
        // Check if city and country were found
        if (city && country) {
          console.log(`City: ${city}, Country: ${country}`);
        } else {
          console.error("Unable to retrieve city or country information.");
          alert("Unable to retrieve city or country information.");
        }
      } else {
        console.error(`API responded with status: ${data.status}`);
        alert("Unable to retrieve city or country information.");
      }
    })
    .catch((error) => {
      console.error("Error: City name was not found", error);
      alert("Error: City name was not found", error);
    });
}

//Fetch weather data based on current location coordinates
function fetchWeatherData(latitude, longitude, cityName, countryName) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_min&daily=weather_code,temperature_2m_max&timezone=Europe/Stockholm`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Sorry something went wrong");
      }
      return response.json();
    })
    .then((data) => {
      // Display current weather
      if (data.current_weather && data.daily) {
        displayWeatherData(
          data.current_weather,
          data.daily,
          cityName,
          countryName
        );
        changeImage(data.current_weather.temperature); // Change background based on temperature
      }
      // Display 5-day weather forecast
      if (data.daily) {
        displayFiveDayForecast(data.daily);
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      alert("Failed to fetch weather data. Please try again.");
    });
}

// Directly map weather codes to descriptions
function getWeatherDescriptions(weatherCode) {
  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  // Return the description or 'Unknown' if not found
  return weatherDescriptions[weatherCode] || "Unknown weather condition";
}

//Gets weather icon depending on temperature and condition
function getWeatherIcon(weatherCode) {
  let icon = "default.png"; // Fallback icon

  if (weatherCode === 0 || weatherCode === 1) {
    icon = "cloudy-day.png";
  } else if (weatherCode === 2 || weatherCode === 3) {
    icon = "cloudy.png";
  } else if (weatherCode === 45 || weatherCode === 48) {
    icon = "foggy.png";
  } else if (weatherCode >= 51 && weatherCode <= 57) {
    icon = "light-rain.png";
  } else if (weatherCode >= 61 && weatherCode <= 67) {
    icon = "moderate-rain.png";
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    icon = "light-snow.png";
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    icon = "heavy-rain.png";
  } else if (weatherCode >= 85 && weatherCode <= 86) {
    icon = "heavy-snow.png";
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    icon = "thunder-rain.png";
  }

  return icon;
}

// Display current weather for today
function displayCurrentWeather(currentWeather) {
  const temperature = currentWeather.temperature;
  const weatherCode = currentWeather.weathercode;

  // Get weather description and icon
  const weatherCondition = getWeatherDescriptions(weatherCode);
  const weatherIcon = getWeatherIcon(weatherCode);
  const weatherLocation = getCurrentLocation(weatherCode);

  console.log(`Current Temperature: ${temperature}°C`);
  console.log(`Current Weather Condition: ${weatherCondition}`);
  //alert(`Today's Temperature: ${temperature}°C, Weather: ${weatherCondition}`);

  // Update the temperature, condition, and icon in the HTML

  document.querySelector("#temperature").textContent = `${temperature}°C`;
  document.querySelector(".condition").textContent = weatherCondition;
  document.querySelector(".weather-icon").src = `assets/${weatherIcon}`;
}

// Display 5-day weather forecast
function displayFiveDayForecast(dailyWeather) {
  const maxTemperature = dailyWeather.temperature_2m_max;
  const minTemperature = dailyWeather.temperature_2m_min;
  const weatherCode = dailyWeather.weather_code;

  const dates = dailyWeather.time;

  // Get the list of forecast elements
  const forecastItems = document.querySelectorAll(".five-day-list li");

  // Loop through the 5-day forecast and display it
  for (let i = 0; i < 5; i++) {
    const dayName = forecastItems[i].querySelector(".day-name");
    const dayTemperature = forecastItems[i].querySelector(".day-temperature");
    const dayIcon = forecastItems[i].querySelector(".day-icon");
    //weather icons
    console.log(dailyWeather);
    dayName.textContent = new Date(dates[i]).toLocaleDateString("en-US", {
      weekday: "short", // e.g., Mon, Tue
    });
    dayTemperature.textContent = `Max: ${maxTemperature[i]}°C, Min: ${minTemperature[i]}°C`;

    //icons
    dayIcon.src = `assets/${getWeatherIcon(weatherCode[i])}`;
    // Limiting to 5 days
    console.log(`Date: ${dates[i]}`);
    console.log("weathercode: ", weatherCode[i]);
    console.log(`Max Temperature: ${maxTemperature[i]}°C`);
    console.log(`Min Temperature: ${minTemperature[i]}°C`);
    //alert(`Date: ${dates[i]} - Max Temperature: ${maxTemperature[i]}°C, Min Temperature: ${minTemperature[i]}°C`);
  }
}
// Call the function once to get the location and fetch weather data
getCurrentLocation();

function displayCurrentTime() {
  const date = new Date();

  // Format the time to hh:mm AM/PM format
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

  const timeElement = document.querySelector(".current-time");

  if (timeElement) {
    timeElement.textContent = formattedTime;
  }
}
// Calls function immediately and then set an interval
displayCurrentTime();
setInterval(displayCurrentTime, 60000);

// Display weather data including temperature, location, date and time
function displayWeatherData(
  currentWeather,
  dailyWeather,
  cityName,
  countryName
) {
  const temperature = currentWeather.temperature; // Current temperature
  const weatherCode = currentWeather.weathercode; // Weather condition code

  // Get max and min temperatures for the day (from dailyWeather)
  const maxTemperature = dailyWeather.temperature_2m_max[0];
  const minTemperature = dailyWeather.temperature_2m_min[0];

  const date = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedDate = `${daysOfWeek[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  }`;

  // Update only if cityName and countryName exist
  if (cityName && countryName) {
    document.querySelector(".country-text").textContent = "";
    document.getElementById(
      "City-ID"
    ).textContent = `${cityName}, ${countryName}`;
  }

  document.querySelector(".current-date-text").textContent = formattedDate;
  document.querySelector(".day-temperature").textContent = `${temperature}°C`;
  document.querySelector(
    "#min-max-temperature"
  ).textContent = `Max: ${maxTemperature}°C, Min: ${minTemperature}°C`;

  // Get weather condition and icon
  const weatherCondition = getWeatherDescriptions(weatherCode);
  const weatherIcon = getWeatherIcon(weatherCode);

  // Update weather condition and icon
  document.querySelector(".condition").textContent = weatherCondition;
  document.querySelector(".weather-icon").src = `assets/${weatherIcon}`;

  displayCurrentTime();

  // Log or display weather data
  console.log(
    `Temperature: ${temperature}°C, Weather Condition: ${weatherCondition}`
  );
}

function updateFiveDayForecast(forecastData) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const forecastContainer = document.querySelectorAll(".five-day-list li");
  forecastData.forEach((day, index) => {
    const date = new Date(day.date);
    const dayName = dayNames[date.getDay()]; // Get day name from date

    forecastContainer[index].querySelector(".day-name").textContent = dayName;
    forecastContainer[index].querySelector(
      ".day-current-temperature"
    ).textContent = day.temperature;

    //console.log("weathercode", day.weatherCode);
    forecastContainer[index].querySelector(
      ".day-temperature"
    ).textContent = `${day.minTemp}°C / ${day.maxTemp}°C`;
    forecastContainer[index].querySelector(".day-icon").textContent = day.icon; // Use image or icon for this
  });
}

// Check if the "Add to Favorites" button exists on the page (for index.html)
const addToFavoritesButton = document.querySelector(".add-to-favorites");

if (addToFavoritesButton) {
  addToFavoritesButton.addEventListener("click", function () {
    const cityName = document.getElementById("City-ID").innerText;

    // Call the function to add the city to localStorage
    addToFavorites(cityName);
  });
}

// Check if the "favorite-list" exists on the page (for favorite.html)
const favoriteCitiesList = document.getElementById("favorite-list");

if (favoriteCitiesList) {
  displayFavoriteCities();
}

// Function to add a city to the favorites list in localStorage
function addToFavorites(cityName) {
  // Retrieve existing favorite cities from localStorage, or create a new array if none exist
  const favoriteCities =
    JSON.parse(localStorage.getItem("favoriteCities")) || [];

  // Only add the city if it's not already in the favorites list
  if (!favoriteCities.includes(cityName)) {
    favoriteCities.push(cityName);
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));

    alert(`${cityName} has been added to your favorites!`);
  } else {
    alert(`${cityName} is already in your favorites!`);
  }
}

// Function to display favorite cities on favorite.html
function displayFavoriteCities() {
  const favoriteCitiesList = document.getElementById("favorite-list");

  // Retrieve favorite cities from localStorage
  const favoriteCities =
    JSON.parse(localStorage.getItem("favoriteCities")) || [];

  // Clear the list before appending new elements
  favoriteCitiesList.innerHTML = "";

  if (favoriteCities.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No favorite cities yet!";
    favoriteCitiesList.appendChild(message);
  } else {
    favoriteCities.forEach((city, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = city;

      // Add a "Remove" button to each city
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "remove-btn";
      removeBtn.addEventListener("click", () => {
        removeCityFromFavorites(index);
      });

      listItem.appendChild(removeBtn);
      favoriteCitiesList.appendChild(listItem);
    });
  }
}

// Function to remove a city from favorites
function removeCityFromFavorites(index) {
  let favoriteCities = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  favoriteCities.splice(index, 1);
  localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));

  // Refresh the favorite cities list
  displayFavoriteCities();
}
