//setting up global variables
var searchHistoryList = $('#searchHistory');
var searchCityInput = $('#searchCity');
var searchButton = $('#searchBtn');
var clearHistoryBtn = $('#clearHistory');
var currentCity = $('#currentCity');
var currentTemp = $('#currentTemp');
var currentHumidity = $('#currentHumidity')
var currentWind = $('#currentWind');
var UVindex = $('#uv');
var weatherContent = $('#weatherContent');

var APIkey = "43085cc5c122e71c89a6e73c44f6936f";

//acccess data
var cityList = [];

//current date and time taken from moment.js
var currentDate = moment().format('L');
$("#current-date").text("(" + currentDate + ")");

//This makes sure the page checks history upon page loading
//I know I will need this at the end - based on reading
// initalizeHistory();
// showClear();

//I think this can be in an if then statement to combine both functions

//user input taken and added to search history when pressing ENTER
$(document).on("submit", function () {
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();
    currentWeather(searchValue)
    searchHistory(searchValue);
    searchCityInput.val("");
});

//user input taken and added to search history btn click
searchButton.on("click", function (event) {
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();

    currentWeather(searchValue)
    searchHistory(searchValue);
    searchCityInput.val("");
});

// Clear History
clearHistoryBtn.on("click", function () {
    cityList = [];
    listArray();
    $(this).addClass("hide");
});
// Search History - on click in line item get data
searchHistoryList.on("click", "li.city-btn", function () {
    var value = $(this).data("value");
    currentWeather(value);
    searchHistory(value);

});

// API request based on user input
function currentWeather(searchValue) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

    //This was my fetch functions but switched to AJAX
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        //pulled all this info from the weather API documentation
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWind.text(response.wind.speed + "MPH");

        var lat = response.coord.lat;
        var lon = response.coord.lon;


        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        $.ajax({
            url: UVurl,
            method: "GET"
        }).then(function (response) {
            UVindex.text(response.value);
        });

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;

        // AJAX call for 5-day forecast
        // I know there is a shorter way to complete this, but I was able to do this round one. If I have time, I will try to shorten.
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (response) {
            console.log('response:', response);
            $('#fiveDay').empty();
            //forloop creates cards
            for (var i = 1; i < response.list.length; i += 8) {

                var forecastDateString = moment(response.list[i].dt_txt).format("L");
                console.log('forecastDateString:', forecastDateString)
                
                //references html page
                var forecastCardBody = $("<div class='card-body card'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastHumidity = $("<p class='card-text mb-0'>");

                //append the new html where five day id is
                $('#fiveDay').append(forecastCardBody);
                //targets specific items onto the card
                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);
                forecastCardBody.append(forecastHumidity);
                //places attributes and content onto page
                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main)
                forecastDate.text(forecastDateString);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");
            }
        })
    });
};

//I have it pulling data, but it is not saving search history. 
// To do: Change UV color
//          Get search history to save
//           Make sure my search history function above works with clicking and displaying data
//             Try to shorten and make dry script - VERY long right now