const cityName = document.querySelector(".city-name");
const country = document.querySelector(".city-country");
const weather = document.querySelector(".weather");
const windSpeed = document.querySelector(".wind-speed");
const windDirection = document.querySelector(".wind-direction");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const temp = document.querySelector(".temp");
const tempFeel = document.querySelector(".temp-feel");
const tempMin = document.querySelector(".temp-min");
const tempMax = document.querySelector(".temp-max");
const sunRise = document.querySelector(".sun-rise");
const sunSet = document.querySelector(".sun-set");

const searchBtn = document.querySelector(".search-btn");
const searchInp = document.querySelector(".search-input");

const showLocationBtn = document.querySelector(".show-location");
const errorMessage = document.querySelector(".error-message");
const weatherIcon = document.querySelector(".weather-icon");

//API call
// const API_FORECAST_LINK = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}&units=metric`;
const API_KEY = "ec2eb94cbb455621542ecc93e3c65ac7";

// CONVERTIONS
const compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

function convertTime(unixTime){
  let dt = new Date(unixTime * 1000)
  let h = dt.getHours()
  let m = "0" + dt.getMinutes()
  let t = h + ":" + m.substr(-2)
  return t
}


const weatherInfo = (data) => {
  console.log('Weather for today', data);
  cityName.textContent = data.name;
  country.textContent = data.sys.country;
  weather.textContent = data.weather[0].description;
  windSpeed.textContent = data.wind.speed + " m/s";
  windDirection.textContent = compassSector[(data.wind.deg / 22.5).toFixed(0)];
  pressure.textContent = data.main.pressure + " hPa";
  humidity.textContent = data.main.humidity + " %";
  temp.textContent = Math.round(data.main.temp) + "°C";
  tempFeel.textContent = Math.round(data.main.feels_like) + "°C";
  tempMin.textContent = Math.round(data.main.temp_min) + "°C";
  tempMax.textContent = Math.round(data.main.temp_max) + "°C";
  sunRise.textContent = convertTime(data.sys.sunrise);
  sunSet.textContent = convertTime(data.sys.sunset);
  errorMessage.textContent = "";

//SETTING UP THE RIGHT ICON
  let status = data.weather[0].id;
  console.log(status);
  if (status >= 200 && status < 300) {
    weatherIcon.setAttribute('src', './media/thunderstorm.png')
  } else if (status >= 300 && status < 400) {
    weatherIcon.setAttribute('src', './media/drizzle.png')
  } else if (status >= 500 && status < 600) {
    weatherIcon.setAttribute('src', './media/rain.png')
  } else if (status >= 600 && status < 700) {
    weatherIcon.setAttribute('src', './media/snow.png')
  } else if (status >= 700 && status < 800) {
    weatherIcon.setAttribute('src', './media/fog.png')
  } else if (status === 800) {
    weatherIcon.setAttribute('src', './media/sun.png')
  } else if (status > 800 && status < 900) {
    weatherIcon.setAttribute('src', './media/cloud.png')
  } else {
    weatherIcon.setAttribute('src', './media/unknown.png')
  }

  }

// WEATHER BY USER LOCATION
const getWeatherByLocation = (coords) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`;
  fetch(URL)
    .then((res) => res.json())
    .then((res) => weatherInfo(res))
    .catch((err) => console.log(err));
};

// GET MY LOCATION
const getMyLocation = () => {
  return navigator.geolocation.getCurrentPosition((position) =>
    getWeatherByLocation(position.coords)
  );
};
getMyLocation();

// SEARCH BY LOCATION
const getWeatherBySearch = (city) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(URL)
    .then((res) => res.json())
    .then((res) => weatherInfo(res))
    .catch((err) => errMsg(err));
    searchInp.value = ''
};

// ERROR MESSAGES
const errMsg = (err) => {
  return (errorMessage.textContent = "Write an existing city name.");
};
const getSearchResult = () => {
    if (searchInp.value !== '') {
			return getWeatherBySearch(searchInp.value)
		} else {
			return (errorMessage.textContent = 'Write name of a city.')
		}
  }

// LISTENERS
searchInp.addEventListener("change", getSearchResult);
searchBtn.addEventListener("click", getSearchResult);
showLocationBtn.addEventListener("click", getMyLocation);
