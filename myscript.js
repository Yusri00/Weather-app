// document.querySelector('.day-name').textContent = 'Monday';
// document.querySelector('.day-temperature').textContent = '15°C';
// document.querySelector('.day-icon').src = 'assets/sunny.png'; // dynamically change icon based on API data

//form.addEventListener('submit', function(event){
//event.preventDefault(); //to make sure the page doesn't reload

// const weatherApi= 'https://api.open-meteo.com/v1/forecast?latitude=59.3293&longitude=18.0686&current_weather=true&timezone=Europe/Stockholm';

//Changes background pictures depending on temperature
function changeImage(temperature) {
  let weatherImage = document.getElementById("weather-image");

  if (temperature >= 25) {
    weatherImage.src = "sun.jpg";
  } else if (temperature >= 18) {
    //Handles temperature between 18-24
    weatherImage.src = "clear.jpg";
  } else if (temperature >= 15) {
    //Handles temperature between 15-17
    weatherImage.src = "thunder.jpg";
  } else if (temperature >= 12) {
    //Handles temperature between 12-14
    weatherImage.src = "cool.jpg";
  } else if (temperature >= 8) {
    //Handles temperature between 8-10
    weatherImage.src = "rain.jpg";
  } else {
    weatherImage.src = "snow.jpg"; //Handles temperature between everything less than 7
  }
}

// const button= document.getElementById('searchButton');

// //When button is clicked execute the function
// button.addEventListener('click', function(){

// });

//Changes background picture based on API and user input
function changeImageInput(search) {
  let weatherImage = document.getElementById("weather-image");
  let userInput = document.getElementById("searchButton");
}

//identify current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Check if location is retrieved

        fetchWeatherData(latitude, longitude); // Fetch weather data based on current location
        // fetchCityName(latitude, longitude);
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

getCurrentLocation(); // This triggers the function to execute

 function fetchCityName(latitude, longitude) {
  const apiKey = " ";
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
        const addressComponents = data.results[0].address_components;
        addressComponents.forEach((component) => {
          // Check for city (locality) or administrative areas
          if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_1") || component.types.includes("sublocality")) 
            {
            city = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
        // Check if city and country were found
        if (city && country) {
          console.log(`City: ${city}`);
          console.log(`Country: ${country}`);
          alert(`Location: ${city}, Country: ${country}`);
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
function fetchWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_min,temperature_2m_max&timezone=Europe/Stockholm`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Sorry something went wrong");
      }
      return response.json();
    })
    .then((data) => {
      // Display current weather
      if (data.current_weather) {
        displayCurrentWeather(data.current_weather);
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

// Display current weather for today
function displayCurrentWeather(currentWeather) {
  const temperature = currentWeather.temperature;
  const weatherCondition = currentWeather.weathercode;

  console.log(`Current Temperature: ${temperature}°C`);
  console.log(`Current Weather Condition: ${weatherCondition}`);
  //   alert(`Today's Temperature: ${temperature}°C, Weather: ${weatherCondition}`);
}

// Display 5-day weather forecast
function displayFiveDayForecast(dailyWeather) {
  const maxTemperature = dailyWeather.temperature_2m_max;
  const minTemperature = dailyWeather.temperature_2m_min;
  const dates = dailyWeather.time;

  // Loop through the 5-day forecast and display it
  for (let i = 0; i < 5; i++) {
    // Limiting to 5 days
    console.log(`Date: ${dates[i]}`);
    console.log(`Max Temperature: ${maxTemperature[i]}°C`);
    console.log(`Min Temperature: ${minTemperature[i]}°C`);
    //  alert(`Date: ${dates[i]} - Max Temperature: ${maxTemperature[i]}°C, Min Temperature: ${minTemperature[i]}°C`);
  }
}
// Call the function to get the location and fetch weather data
getCurrentLocation();

function displayWeatherData(weather) {
  // Ensure we get all required data from the weather object
  const temperature = weather.temperature; // Current temperature
  const minTemperature = weather.temperature_2m_min || "N/A"; // Minimum temperature
  const maxTemperature = weather.temperature_2m_max || "N/A"; // Maximum temperature

  // Get the current date and time
  const date = new Date();
  const formattedDate = date.toLocaleDateString(); // Format the date
  const formattedTime = date.toLocaleTimeString(); // Format the time

  // Log or display weather data
  console.log(`Temperature: ${temperature}°C`);
  console.log(`Min Temperature: ${minTemperature}°C, Max Temperature: ${maxTemperature}°C`);
  console.log(`Date: ${formattedDate}`);
  console.log(`Time: ${formattedTime}`);

  //alert(`Temperature: ${currentTemperature}°C, Min: ${minTemperature}, Max: ${maxTemperature}°C, Date: ${currentDate.toLocaleDateString()}, Time: ${currentTime}`);
}