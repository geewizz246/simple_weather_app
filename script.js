// API Documentation: https://openweathermap.org/current

let appId = '255081faadd6aecbe8baf11f30434b09'; // API key for OpenWeatherMap
let units = 'metric'; // Either metric or imperial
let searchMethod = 'zip'; 
/*
  Search Method Examples:
    - City Name ==> 'q'
        'q={city name}' OR
        'q={city name},{country code}'
    - City ID ==> 'id'
        'id=2172797'
        List of city IDs here: http://bulk.openweathermap.org/sample/
    - Geographic Coordinates ==> 'lat'
        'lat={lat}&lon={lon};
    - Others ==> https://openweathermap.org/current
*/


// Determine the search method based on user input
function getSearchMethod(searchTerm) {
  // zipRegx ==> a string of 5 digits
  zipRegx = /^\d{5}$/;
  if (zipRegx.test(searchTerm)) {
    searchMethod = 'zip';
  } else {
    searchMethod = 'q';
  }

}


// Search for the weather through OpenWeatherMap API call
function searchWeather(searchTerm) {
  getSearchMethod();

  // In order to inject JS into a string use ${} and enclose the string in backticks (``).

  // URL to fetch nformation from the API
  fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`)
    .then(result => { // Change the result into a readable JSON format
      return result.json();
    }).then(result => {
      init(result);
    });
}


function init(resultFromServer) {
  // Show the JSON result in the console
  console.log(resultFromServer)

  // Change the background
  switch (resultFromServer.weather[0].main) {
    case 'Clear':
      document.body.style.backgroundImage = 'url("imgs/clear.jpg")';
      break;

    case 'Clouds':
      document.body.style.backgroundImage = 'url("imgs/cloudy.jpg")';
      break;

    // Do the same thing for Rain, Drizzle and Mist
    case 'Rain':
    case 'Drizzle':
    case 'Mist':
      document.body.style.backgroundImage = 'url("imgs/rain.jpg")';
      break;

    case 'Thunderstorm':
      document.body.style.backgroundImage = 'url("imgs/storm.jpg")';
      break;

    case 'Snow':
      document.body.style.backgroundImage = 'url("imgs/snow.jpg")';
      break;

    default:
      document.body.style.backgroundImage = 'url("imgs/default.jpg")';
      break;
  }

  let weatherDescriptionHeader = document.getElementById("weatherDescriptionHeader");
  let timeElement = document.getElementById("time");
  let temperatureElement = document.getElementById("temperature");
  let humidityElement = document.getElementById("humidity");
  let windSpeedElement = document.getElementById("windSpeed");
  let cityHeader = document.getElementById("cityHeader");
  let weatherIcon = document.getElementById("documentIconImg");

  // Get the weather icon
  // See here: https://openweathermap.org/weather-conditions
  weatherIcon.src = 'http://openweathermap.org/img/wn/' + resultFromServer.weather[0].icon + '.png'
  
  // Get weather description
  let resultDescription = resultFromServer.weather[0].description;
  resultDescription = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
  weatherDescriptionHeader.innerText = resultDescription;

  // Get time, emperature, wind speed, city, humidity
  let timeZoneOffset = resultFromServer.timezone;
  let time = new Date(resultFromServer.dt * 1000 + (timeZoneOffset * 1000));
  timeElement.innerHTML = time.toUTCString().slice(0, 25);
  temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) // Math.floor rounds variable down to nearest whole number
    + '&#176'; // Degree sign '°' code in HTML
    // + (units === 'imperial' ? 'F' : 'C');
  windSpeedElement.innerHTML = 'Winds at ' + Math.floor(resultFromServer.wind.speed) + ' m/s';
  cityHeader.innerHTML = resultFromServer.name;
  humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.main.humidity + '%';

  setPositionForWeatherInfo();
}


function setPositionForWeatherInfo() {
  let weatherContainer = document.getElementById('weatherContainer');
  let weatherContainerHeight = weatherContainer.clientHeight;
  let weatherContainerWidth = weatherContainer.clientWidth;

  weatherContainer.style.left = `calc(50% - ${weatherContainerWidth/2}px)`;
  weatherContainer.style.top = `calc(50% - ${weatherContainerHeight/1.3}px)`;
  weatherContainer.style.visibility = 'visible';
}


// Get the search query from the search bar via button click
document.getElementById('searchBtn').addEventListener('click', () => {
  let searchTerm = document.getElementById('searchInput').value;
  if (searchTerm) {
    searchWeather(searchTerm);
  }
});
// ...via enter key
document.getElementById('searchInput').addEventListener('keyup', function (e) {
  if (e.keyCode === 13) { // key code for 13
    let searchTerm = document.getElementById('searchInput').value;
    if (searchTerm) {
      searchWeather(searchTerm);
    }
  }
});