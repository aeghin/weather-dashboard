$(document).ready(function () {
    var apiID = "f78978964bad26413a9e8279074652a2";
    var weather = "";
    var city = "";
    var currentDate = moment().format("L");
    var searchHistory = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));


    function currentWeather() {

        // Grabbing the value from the user input.
        if ($(this).attr("id") === "submit-city") {
            city = $("#city").val();
        } else {
            city = $(this).text();
        }
        // passing content to the weather variable with the correct query properties based on user input.
        weather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiID;
        // console.log(searchHistory.indexOf(city));

        if (searchHistory.indexOf(city) === -1) {

            searchHistory.push(city);
        }

        // console.log(searchHistory);
        // Local storage 
        localStorage.setItem("cities", JSON.stringify(searchHistory));
        // calculating temp and windspeed
        $.getJSON(weather, function (json) {
            let temp = (json.main.temp - 273.15) * (9 / 5) + 32;
            let windspeed = json.wind.speed * 2.237;

            $("#current-city").text(json.name + " " + currentDate);
            $("#weather-img").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").text(temp.toFixed(2) + "°F");
            $("#humidity").text(json.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(2) + " " + "mph");
        });
    }
    // function for five day forecast
    function fiveDayForecast() {
        let fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=" + apiID;

        let dayCounter = 1;
// Using ajax to 'GET' the list and run a loop for the 5 day forecast.
        $.ajax({
            url: fiveDay,
            method: "GET"
        }).then(function (response) {

// Changing the text here
            for (let i = 0; i < response.list.length; i++) {
            
                let dateTime = response.list[i].dt_txt;
                let date = dateTime.split(" ")[0];
                let time = dateTime.split(" ")[1];

                if (time === "15:00:00") {
                    let year = date.split("-")[0];
                    let month = date.split("-")[1];
                    let day = date.split("-")[2];
                    $("#day-" + dayCounter).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#day-" + dayCounter).children(".weather-icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day-" + dayCounter).children(".weather-temp").text("Temp: " + ((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(2) + "°F");
                    $("#day-" + dayCounter).children(".weather-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    dayCounter++;
                }
            }
        });
    }
// This function will trigger the history and appending the previous searches while adding event listener. 
    function weatherSearchHistory() {

        $("#search-history").empty();
        searchHistory.forEach(function (city) {


            console.log(searchHistory);
            let historyItem = $("<li>");

            historyItem.addClass("list-group-item btn btn-light");
            historyItem.text(city);

            $("#search-history").prepend(historyItem);
        });
        $(".btn").click(currentWeather);
        $(".btn").click(fiveDayForecast);

    }

    // emptying history here.
    function clearHistory() {
        $("#search-history").empty();
        searchHistory = [];
        localStorage.setItem("cities", JSON.stringify(searchHistory));
    }

    $("#clear-history").click(clearHistory);
    $("#submit-city").click(weatherSearchHistory);

});

