const API_KEY = "dc2d14ea2a5059357dde02b9254c2e53";

// API for city - `https://api.openweathermap.org/data/2.5/weather?q=${city}&apiid=${API_KEY}&units=metric`

// API for current location - `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&apiid=${API_KEY}&units=metric`

const grantAccess = document.querySelector("#grantAccess");
const grantAccessBtn = document.querySelector("#grantAccessBtn");
const cityName = document.querySelector('#city');
const countryFlag = document.querySelector('#flag');
const desc = document.querySelector('#description');
const descImg = document.querySelector('#descImg');
const temp = document.querySelector('#tempData');
const windspeedData = document.querySelector("[data-windspeed]");
const humidityData = document.querySelector("[data-humidity]");
const cloudsData = document.querySelector("[data-clouds]");
const loader = document.querySelector("#loaderImg");
const weatherDataContainer = document.querySelector(".weatherData");

const askForLocation = () => {
  grantAccess.style.display = "flex";
};

grantAccessBtn.addEventListener("click", () => {
  grantAccess.style.display = "none";
});

async function fetchLocationByCoors(latitude, longitude) {
  
    try {
        const lat = this.latitude;
        const lon = this.longitude;
        const currLocation = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const currWeatherData = await currLocation.json();
        console.log(currWeatherData);

        cityName.innerHTML = currWeatherData?.name;
        countryFlag.src = `https://flagcdn.com/144x108/${currWeatherData?.sys?.country.toLowerCase()}.png`;

        desc.innerHTML = currWeatherData?.weather[0]?.main;
        descImg.src = `https://openweathermap.org/img/w/${currWeatherData?.weather[0]?.icon}.png`;

        temp.innerHTML = `${currWeatherData?.main?.temp} °C`;

        windspeedData.innerHTML = `${currWeatherData?.wind?.speed} m/s`;
        humidityData.innerHTML = `${currWeatherData?.main?.humidity} %`;
        cloudsData.innerHTML = `${currWeatherData?.clouds?.all} %`;
    }
    catch(error) {
        console.log(error.toString());
    } finally {
        stopLoader();
    }

}

const stopLoader = () => {
    loader.style.display = "none";
    weatherDataContainer.style.display = "flex";
};

function getCoords() {
  return new Promise((resolve, reject) =>
    navigator.permissions
      ? // Permission API is implemented
        navigator.permissions
          .query({
            name: "geolocation",
          })
          .then((permission) =>
            // is geolocation granted?
            permission.state === "granted"
              ? navigator.geolocation.getCurrentPosition((currPos) => {
                  fetchLocationByCoors(
                    currPos.coords.latitude,
                    currPos.coords.longitude
                  );
                })
              : askForLocation()
          )
      : // Permission API was not implemented
        reject(new Error("Permission API is not supported"))
  );
}

getCoords().then((coords) => console.log(coords));


