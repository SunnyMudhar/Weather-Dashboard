let searchBtn = $('.search-button');

searchBtn.on("click", async function (event) {
    event.preventDefault();
    const data = await getAPIData();
});

async function getAPIData() {
    const cityName = "london";
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