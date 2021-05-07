var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=43085cc5c122e71c89a6e73c44f6936f'
var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=`+lat+`&lon=`+lon+`&exclude=hourly,daily&appid=43085cc5c122e71c89a6e73c44f6936f`
var lat;
var lon;
var res;
// var responseText = document.getElementById('response-text')

function getAPI(URL) {
    fetch(URL)
    .then(function (response) {
       
       return response.json();
    }) 
    .then(function (data) {
        //set var for lad and long here using data.coord
      
    })
}

getAPI (requestUrl);

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