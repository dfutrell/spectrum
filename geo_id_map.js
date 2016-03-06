var geo_city = {
    "Boston": "16000US2507000",
    "New York": "16000US3651000",
    "Chicago": "16000US1714000",
    "Seattle": "16000US5363000",
    "San Francisco": "16000US0667000",
}

var getURLforCity = function(cityName) {
    return "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B02001&geo_ids=" + geo_city[cityName]
}

var request = require('sync-request');

var getDataforCity = function(cityName) {
    var cityURL = getURLforCity(cityName);
    var response = request('GET', cityURL);
    return JSON.parse(response.getBody().toString());
}

getDataforCity("San Francisco")

var cities = Object.keys(geo_city)

var raceData = cities.map(getDataforCity)

var raceDataText = JSON.stringify(raceData)

var fs = require('fs')

fs.writeFileSync("sample_race_x_city.js", raceDataText)

var raceXcityString = fs.readFileSync("sample_race_x_city.js")

var raceXcityJS = JSON.parse(raceXcityString)

var cityTranslate = function(cityName) {
    if (geo_city.hasOwnProperty(cityName)) {
        return geo_city[cityName]
    }
}

var getGeoID = function(raceDataDictionary) {
    var geographyDictionary = raceDataDictionary.geography;
    var geoId = Object.keys(geographyDictionary)[0];
    return geoId;
}

// map city name to geo id in db

getGeoID(raceXcityJS[0]);

var gidFind = function(cityName) {

    var geoIDtoFind = geo_city[cityName]

    raceXcityJS.filter(function(dictionaryToFind) {
        return getGeoID(dictionaryToFind) == geoIDtoFind })
    var correctDictionary = raceXcityJS.filter(function(dictionaryToFind) {
        return getGeoID(dictionaryToFind) == geoIDtoFind })

    return correctDictionary[0]
}

// append city to end of URL

var raceDataTextBoston = JSON.stringify(gidFind("Boston"))

var fs = require('fs')

fs.writeFileSync("sample_race_x_city_boston.json", raceDataTextBoston)

var express = require('express');
var app = express();

app.get('/:cityName', function(req, res) {
    res.send(JSON.stringify(gidFind(req.params.cityName)));
});

// serve html

app.get('/', function(req, res) {
    res.sendFile("test.html",{root:"."});
});

// turns on the server

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

