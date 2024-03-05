let searchInput = $('#search-input');
let forecastRow = $('#forecast');
let todayForecast = $('#today');
let history = $('#history');

let today = dayjs().format('DD MMM YYYY');

let weatherData = {};
let historyArr = [];
let userInput;

$(document).ready( function() {
    checkLocalStorage();
});

$('body').on('click', '.search-button', async function (event) {
    event.preventDefault();
    userInput = $(event.target).attr('id') === "search-button" ? searchInput.val().toLowerCase() : $(event.target).text();
    if(userInput === "") return;
    weatherData = await getAPIData(userInput);
    saveData(userInput);
    createCards();
});

async function getAPIData(input) {
    const cityName = input;
    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName + "&appid=fc0824feafecf2b696e4b7d72043b278&units=metric";

    try {
        const response = await fetch(queryURL);
        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Fetch error: ", error);
    }
}

function clearForm() {
    todayForecast.empty();
    forecastRow.empty();
    history.empty();
}

async function saveData(input) {
    Promise.all(historyArr.unshift(input), historyArr = historyArr.slice(0, 5));
    localStorage.setItem("historyArr", JSON.stringify(historyArr));
    localStorage.setItem("weatherData", JSON.stringify(weatherData));
}

function checkLocalStorage() {
    if(!JSON.parse(localStorage.getItem("weatherData")) && Object.keys(weatherData).length === 0 ) return;
    weatherData = JSON.parse(localStorage.getItem("weatherData"));
    historyArr = JSON.parse(localStorage.getItem("historyArr"));
    createCards();
}

function createSearchHistory() {
    if(historyArr.length === 0) return;
    for(var i = 0; i < historyArr.length; i++) {
        var historyBtn = `
        <button type="submit" class="btn search-button" id="search-history" aria-label="submit search">${historyArr[i]}</button>
        `;
        history.append(historyBtn);
    }
}

function createCards() {
    clearForm();
    createSearchHistory();

    var mainCard = `
        <div class="card">
            <h5 class="card-header">${weatherData.city.name}</h5>
            <div class="card-body">
                <h5 class="card-title">${today}</h5>
                <img src="http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png" alt="weather icon" class="weather-icon">
                <p class="card-text">Temp: ${weatherData.list[0].main.temp} &deg;C</p>
                <p class="card-text">Wind: ${weatherData.list[0].wind.speed} MPH</p>
                <p class="card-text">Humidity: ${weatherData.list[0].main.humidity}%</p>
            </div>
        </div>
    `;

    todayForecast.append(mainCard);

    let title = `<h2>5 day Forecast</h2>`

    forecastRow.append(title)

    for(var i = 0; i < weatherData.list.length; i+=8) {

        let dateArr = weatherData.list[i].dt_txt.split(" ");
        date = dateArr[0].split("-").reverse().join("/");

        var forecastCard = `
        <div class="card forecast-cards col-lg-2 col-md-8 col-sm-12">
            <div class="card-body">
                <h5 class="card-title">${date}</h5>
                <img src="http://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}.png" alt="weather icon" class="weather-icon">
                <p class="card-text">Temp: ${weatherData.list[i].main.temp}&deg;C</p>
                <p class="card-text">Wind: ${weatherData.list[i].wind.speed} MPH</p>
                <p class="card-text">Humidity: ${weatherData.list[i].main.humidity}%</p>
            </div>
        </div>
        
        `;

        forecastRow.append(forecastCard);
    }
}