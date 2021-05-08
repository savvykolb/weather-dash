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
// initalizeHistory();
// showClear();

//I think this can be in an if then statement to combine both functions

//user input taken and added to search history when pressing ENTER
$(document).on("submit", function(){
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();
    currentWeather(searchValue)
    searchHistory(searchValue);
    searchCityInput.val(""); 
});

//user input taken and added to search history btn click
searchButton.on("click", function(event){
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();

    currentWeather(searchValue)
    searchHistory(searchValue);    
    searchCityInput.val(""); 
});

// Clear History
clearHistoryBtn.on("click", function(){
    cityList = [];
    listArray();
    $(this).addClass("hide");
});

searchHistoryList.on("click","li.city-btn", function(event) {
    var value = $(this).data("value");
    currentConditionsRequest(value);
    searchHistory(value); 

});

// API request based on user input
function currentWeather(searchValue) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;
    
    //This was my fetch functions but switched to AJAX
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
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
        }).then(function(response){
            // console.log("UV call: ")
            // console.log(response);
            UVindex.text(response.value);
        });

        var countryCode = response.sys.country;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat +  "&lon=" + lon;
        
       
