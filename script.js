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

//user input taken and added to search history when pressing ENTER - 'submit'
$(document).on("submit", function () {
    event.preventDefault();
    //created value to take the user input then run the two functions with that value.
    var searchValue = searchCityInput.val().trim();
    currentWeather(searchValue)
    searchHistory(searchValue);
    //sets the form back to blank
    searchCityInput.val("");
});

//user input taken and added to search history btn click - 'click'
searchButton.on("click", function (event) {
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();

    currentWeather(searchValue)
    searchHistory(searchValue);
    searchCityInput.val("");
});

// Clear History when clicked - creates an empty array and calls the function listArray
clearHistoryBtn.on("click", function () {
    cityList = [];
    listArray();
});

// Search History - on click in line item get data
searchHistoryList.on("click", "li.city-btn", function () {
    //this calls the user data value from the history list. It then calls the 2 functions with the clicked value.
    var value = $(this).data("value");
    currentWeather(value);
    searchHistory(value);

});

// API request based on user input - searchValue is a variable declared above.
function currentWeather(searchValue) {
    console.log('searchValue:', searchValue)

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;
 

    //This was my fetch function but switched to AJAX
    //go to queryURL, GET me that information - THEN with that data, do the following:
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log('current then:', response)

        //pulled all this info from the current weather API and dsiplay on screen
        //current city on HTML replace with input name + current date + image icon from API (weather-0-icon id see in console)
        currentCity.text(response.name); 
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWind.text(response.wind.speed + "MPH");

        //declared these variables to use in next API pulls - just needed the lat and lon coordinates for 5 day
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        //UV API URL with lat and lon
        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        $.ajax({
            url: UVurl,
            method: "GET"
        }).then(function (response) {
            UVindex.text(response.value);
            //console log to make sure it pulled correct
            console.log('UVresponse.value:', response.value)
            
            //5-day URL with lat and lon coordinates
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;
        
            // AJAX call for 5-day forecast
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                console.log('5dayThen:', response);
                //got to 5day id and remove all child elements to then create the cards with for loop
                $('#fiveDay').empty();
                //start at the list item 1 then add 8 line items to get to next day. Create a card for each day. 
                    //it only makes 5 cards because it is the 5 day API
                for (var i = 1; i < response.list.length; i += 8) {

                    //display the date found in data
                    var forecastDateString = moment(response.list[i].dt_txt).format("L");
                    console.log('forecastDateString:', forecastDateString)
        
                    //html
                    var forecastCardBody = $("<div class='card-body card'>");
                    var forecastDate = $("<h5 class='card-title'>");
                    var forecastIcon = $("<img>");
                    var forecastTemp = $("<p class='card-text mb-0'>");
                    var forecastHumidity = $("<p class='card-text mb-0'>");
        
                    //append the new html where five day id is
                    $('#fiveDay').append(forecastCardBody);
                    //targets specific items onto the card
                        //same idea as current day
                    forecastCardBody.append(forecastDate);
                    forecastCardBody.append(forecastIcon);
                    forecastCardBody.append(forecastTemp);
                    forecastCardBody.append(forecastHumidity);
                    //places attributes from API data and content onto page
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

        });
};

//This function puts search history on the page in correct order
function searchHistory(searchValue) {
    if (searchValue) {
        if (cityList.indexOf(searchValue) === -1) {
            cityList.push(searchValue);
            listArray();
        } else {
            var removeIndex = cityList.indexOf(searchValue);
            cityList.splice(removeIndex, 1);
            cityList.push(searchValue);
            listArray();
        }
    }
}
// List ALL the searched cities the user inputs and stores in local storage.
function listArray() {
    searchHistoryList.empty();
    cityList.forEach(function (city) {
        var searchHistoryItem = $('<li class="list-group-item city-btn">');
        searchHistoryItem.attr("data-value", city);
        searchHistoryItem.text(city);
        searchHistoryList.prepend(searchHistoryItem);
    });
    localStorage.setItem("cities", JSON.stringify(cityList));
}

// This function keeps the users history on page reload. 
function initalizeHistory() {
    if (localStorage.getItem("cities")) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cityList.length - 1;
        console.log('cityList:', cityList)

        listArray();
        if (cityList.length !== 0) {
            currentWeather(cityList[lastIndex]);
            weatherContent.removeClass("hide");
        }
    }
}
//clear history
function showClear() {
    if (searchHistoryList.text() !== "") {
        clearHistoryBtn.removeClass("hide");
    }
}

// To do: Change UV color
