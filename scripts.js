console.log(cities)

// this functions like document.ready()
function initMap() {
    console.log("Map loaded")
    myLatlng = {
        lat: 40.0000,
        lng: -98.0000
    };
    var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: myLatlng
        })
        // markers array
    var markers = [];
    // global infoWindow for everyone to share
    var infoWindow = new google.maps.InfoWindow({});
    // loop through the cities aray which is in cities.js
    var listHTML = '';
    cities.map((city) => {
        createMarker(city);
        listHTML += addCityToList(city);
    });
    $('#cities-table tbody').html(listHTML);
    $('#filter-form').submit(function(event) {
        // wipe out all markers
        // so that you can view the only the markers that the user wants
        markers.map(function(marker) {
            marker.setMap(null);
        });
        event.preventDefault();
        console.log("User submission");
        // set our user input to lower case
        var userSearch = $('#filter-input').val().toLowerCase();
        listHTML = '';
        cities.map((city) => {
            // set all city names to lower case in our cities object
            var cityName = city.city.toLowerCase();
            if (city.city.indexOf(userSearch) !== -1) {
                // the city we are on, contains the search text the user entered
                createMarker(city);
                listHTML += addCityToList(city);
            }
        });
    });

    function addCityToList(city) {
        var newHTML = '<tr>';
        newHTML += `<td class="city-name">${city.city}</td>`;
        newHTML += `<td class="city-state">${city.state}</td>`;
        newHTML += `<td class="city-directions"><button class="btn btn-primary">Get Directions</button></td>`;
        newHTML += `<td class="city-zoom"><button class="btn btn-success">Zoom</button></td>`;
        newHTML += '</tr>'
        return newHTML;
    }

    function createMarker(city) {
        // console.log(city);
        // set up an object with this cities lat/lon
        var cityLL = {
            lat: city.lat,
            lng: city.lon
        }
        var marker = new google.maps.Marker({
            position: cityLL,
            map: map,
            title: city.city
        });
        // add a click listener to THIS marker
        // addListener takes 3 args:
        // 1. What
        // 2. Event
        // 3. Code to run
        google.maps.event.addListener(marker, 'click', () => {

            var infoWindowHTML = `<h2>${city.city}</h2>`
            infoWindowHTML += `<h4>City population: ${city.yearEstimate}</h4>`
                // open takes 2 args:
                // 1. Map to open to infoWindow on
                // 2. Where to put the infoWindow on the map
            infoWindow.setContent(infoWindowHTML);
            infoWindow.open(map, marker);
        })
        markers.push(marker);
    }
};