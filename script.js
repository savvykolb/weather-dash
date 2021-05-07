var currentCall;
var fiveDayCall;
var searchBtn = $("#searchBtn")
var SearchInput;
var lat;
var lon;
var res;

// Forloop for putting data onto the HTML
for (var i = 0; i < localstorage.length; index++) {
   var city =localStorage.getitem(i);    

   var cityName = $("#cityResults").addClass("list-group-item");

   cityName.append("<li>" + city + "</li>");
}

var keyCount = 0;

searchBtn.click(function () {
    searchInput = $("#searchCity").val();
    currentCall = 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=43085cc5c122e71c89a6e73c44f6936f'
    fiveDayCall = `https://api.openweathermap.org/data/2.5/onecall?lat=`+lat+`&lon=`+lon+`&exclude=hourly,daily&appid=43085cc5c122e71c89a6e73c44f6936f`
    
})

function getAPI(URL) {
    fetch(URL)
    .then(function (response) {
       
       return response.json();
    }) 
    .then(function (data) {
        //set var for lad and long here using data.coord
      
    })
}

getAPI (currentCall);

function oneCall(URL) {
    fetch(URL)
    .then(function (response) {
       
       return response.json();
    }) 
    .then(function (data) {
        //set var for lad and long here using data.coord
        lat = data.coord.lat
        lon = data.coord.lon
         console.log(lat, lon)
        // console.log(data.coord)
        
    })
}


``