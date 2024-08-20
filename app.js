const API_KEY = "dc2d14ea2a5059357dde02b9254c2e53";

// API for city - `https://api.openweathermap.org/data/2.5/weather?q=${city}&apiid=${API_KEY}&units=metric`

// API for current location - `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&apiid=${API_KEY}&units=metric`

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grantAccess");
const searchCity = document.querySelector(".search");
const loadingScreen = document.querySelector(".loader-container");
const userDataContainer = document.querySelector(".User-Weather-Data");

let currentTab = userTab;
currentTab.classList.add("current-tab");

getfromSessionStorage();

const switchTab = (clickedTab) => {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(currentTab == searchTab) {
            grantAccess.classList.remove("active");
            userDataContainer.classList.remove("active");
            searchCity.classList.add("active");
        }
        else {
            userDataContainer.classList.remove("active");
            searchCity.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getfromSessionStorage() {
    const loaclCoordinates = sessionStorage.getItem("user-coordinates");

    if(!loaclCoordinates) {
        grantAccess.classList.add("active");
        userDataContainer.classList.remove("active");
    }
    else {
        const coordinates = JSON.parse(loaclCoordinates);
        fetchLocationByCoors(coordinates);
    }
}

    
async function fetchLocationByCoors(coordinates) {

    const {lat, long} = coordinates;

    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");
      
    try {
        const currLocation = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
        );

        const currWeatherData = await currLocation.json();
        renderWeatherData(currWeatherData);
        loadingScreen.classList.remove("active");
        userDataContainer.classList.add("active");

    }
    catch(error) {
        console.log(error.toString());
    }
}

function renderWeatherData(currWeatherData) {

    const cityName = document.querySelector('#city');
    const countryFlag = document.querySelector('#flag');
    const desc = document.querySelector('#description');
    const descImg = document.querySelector('#descImg');
    const temp = document.querySelector('#tempData');
    const windspeedData = document.querySelector("[data-windspeed]");
    const humidityData = document.querySelector("[data-humidity]");
    const cloudsData = document.querySelector("[data-clouds]");

    cityName.innerText = currWeatherData?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${currWeatherData?.sys?.country.toLowerCase()}.png`;

    desc.innerText = currWeatherData?.weather[0]?.main;
    descImg.src = `https://openweathermap.org/img/w/${currWeatherData?.weather[0]?.icon}.png`;

    temp.innerText = `${currWeatherData?.main?.temp} °C`;

    windspeedData.innerText = `${currWeatherData?.wind?.speed} m/s`;
    humidityData.innerText = `${currWeatherData?.main?.humidity} %`;
    cloudsData.innerText = `${currWeatherData?.clouds?.all} %`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("No loaction found!!");
        userDataContainer.classList.remove("active");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchLocationByCoors(userCoordinates);
}

const grantAccessBtn = document.querySelector("#grantAccessBtn");
grantAccessBtn.addEventListener("click", getLocation)

const searchInput = document.querySelector("#searchWeatherInput");
const searchBtn = document.querySelector("#searchWeatherBtn");
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") return;

    fetchLocationByCityName(cityName);
})

async function fetchLocationByCityName(cityName) {
    loadingScreen.classList.add("active");
    userDataContainer.classList.remove("active");
    grantAccess.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);

        const weatherData = await response.json();
        console.log(weatherData);
        renderWeatherData(weatherData);
        loadingScreen.classList.remove("active");
        userDataContainer.classList.add("active");
    }
    catch(err) {
        console.log(err);
    }
}



// async function getCoordsByCityName(cityName) {
//     loadingScreen.classList.add("active");
//     userDataContainer.classList.remove("active");
//     grantAccess.classList.remove("active");

//     try {
//         const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`);

//         const weatherData = await response.json();
//         console.log(weatherData);

//         const userCoordinates = {
//             lat: weatherData?.[0]?.lat,
//             long: weatherData?.[0]?.lon
//         }        

//         fetchLocationByCoors(userCoordinates);
//         loadingScreen.classList.remove("active");
//         userDataContainer.classList.add("active");
//     }
//     catch(err) {

//     }
// }


