let searchBtn = $('.search-button');
let searchInput = $('#search-input');

let weatherData = {};

$(document).ready( function() {
    checkLocalStorage();
});

searchBtn.on("click", async function (event) {
    event.preventDefault();
    weatherData = await getAPIData();
    saveData();
});

async function getAPIData() {
    const cityName = searchInput.val().toLowerCase();
    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName + "&appid=fc0824feafecf2b696e4b7d72043b278";

    try {
        const response = await fetch(queryURL);
        const result = await response.json();
        console.log(result);
        return result;
      } catch (error) {
        console.error("Fetch error: ", error);
    }
}

function saveData() {
    localStorage.setItem("weatherData", JSON.stringify(weatherData));
}

function checkLocalStorage() {
    if(!JSON.parse(localStorage.getItem("weatherData"))) return;
    weatherData = JSON.parse(localStorage.getItem("weatherData"));
}