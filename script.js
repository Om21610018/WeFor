const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");
const userContainer = document.querySelector(".weather-Container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//Initiallly we required variables
let oldTab = userTab; //by default current tab userTab hoga
const API_KEY = "5b24fa5f49ecc249c5ec639de34b5689";
getfromSessionStorage();
oldTab.classList.add("current-tab");

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  console.log(coordinates.lat);
  console.log(coordinates.lon);
  //make grant container invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=5b24fa5f49ecc249c5ec639de34b5689&units=metric
      `
    );

    const data =await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    //Not found page
  }
}

function getLocation() {
  //system supports geo location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPostition);
  } else {
    //if system not supports geo location
    //* Show an alert for no geo location support available
    console.log("nhi mila location");
  }
}

function showPostition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

function switchTab(newTab) {
  //age same tab pe hi click kiya jaha pahle se ho to do nothing
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    // kya search form wala container is invisible, if yes then make it visible
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
      searchInput.value="";
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main yourweather tab me aagya hu toh weather bhi diplay karna pdega so let's check local storage first for coordinates if we haves saved them there
      getfromSessionStorage();
      searchInput.value="";
    }
  }
}

//IF USER CLICKED ON USER TAB
userTab.addEventListener("click", function () {
  //pass clicked tab as input parameter
  switchTab(userTab);
});

//IF USER CLICKED ON SEARCH TAB
searchTab.addEventListener("click", function () {
  //pass clicked tab as input parameter
  switchTab(searchTab);
});

//check if coordinates are laready present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("userCoordinates");
  if (!localCoordinates) {
    // agr coordinates save nhi hue toh
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

function renderWeatherInfo(data) {
  // firstly we have to fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from api and show on ui
  cityName.innerHTML = data?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  desc.innerHTML = data?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temp.innerHTML = `${data?.main?.temp}°C`;
  windspeed.innerHTML = `${data?.wind?.speed}m/s`;
  humidity.innerHTML = `${data?.main?.humidity}%`;
  cloudiness.innerHTML = `${data?.clouds?.all}%`;
}

const searchInput = document.querySelector("[data-searchInput]");
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit", function (e) {
  e.preventDefault(); //default method ko htata hai
  let cityName = searchInput.value;
  if (cityName == "") return;
  else {
    fetchSearchWeatherInfo(cityName);
    
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessButton.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5b24fa5f49ecc249c5ec639de34b5689&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //not found error
  }
}

// https://api.openweathermap.org/data/2.5/weather?lat=19.0748&lon=72.8856&appid=5b24fa5f49ecc249c5ec639de34b5689&units=metric
