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
initalizeHistory();
showClear();

//I think this can be in an if then statement

//user input taken and added to search history when pressing ENTER
$(document).on("submit", function(){
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();
    currentConditionsRequest(searchValue)
    searchHistory(searchValue);
    searchCityInput.val(""); 
});

//user input taken and added to search history btn click
searchCityButton.on("click", function(event){
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistory(searchValue);    
    searchCityInput.val(""); 
});

// Clear History
clearHistoryButton.on("click", function(){
    cityList = [];
    listArray();
    $(this).addClass("hide");
});


