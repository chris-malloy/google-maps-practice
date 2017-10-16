$(document).ready(function() {
    var google = window.google;
    // console.log('map loaded');
    // geographic center of the US
    myLatlng = {
        lat: 40.0000,
        lng: -98.0000
    };
    // Init the map to load at geoCenter, zoom 4
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatlng
    });
    // markers array
    var markers = [];
    // global infoWindow for everyone to share
    var infoWindow = new google.maps.InfoWindow({});
    // loop through the cities array which is in cities.js
    var listHTML = '';
    cities.map((city) => {
        createMarker(city);
        listHTML += addCityToList(city);
    });
    $('#cities-table tbody').html(listHTML);
    $('.city-name').click(function() {
        // trigger will simulate any google maps event
        // 2 args what element and which event
        var index = $(this).attr('index');
        google.maps.event.trigger(markers[index], "click");
    });
    $('.city-zoom').click(function() {
        console.log($(this))
        var index = $(this).attr('index');
        // console.log(cities)
        zoomToCity(cities[index].lat, cities[index].lon)
    });
    $('.city-directions').click(function() {
        var index = $(this).attr('index')
    })

    // Add submit listener to the form
    $('#filter-form').submit(function(event) {
        // wipe out all the markers
        markers.map((marker) => {
            marker.setMap(null);
        });


        event.preventDefault();
        // user submitted the input box
        // console.log("User submission!");
        var userSearch = $('#filter-input').val().toLowerCase();
        listHTML = '';
        cities.map((city) => {
            var cityName = city.city.toLowerCase();
            if (cityName.indexOf(userSearch) > -1) {
                // The city we are on, contains the search text the user entered
                createMarker(city);
                listHTML += addCityToList(city);
            }
        });
        $('#cities-table tbody').html(listHTML);

    });

    function addCityToList(city, index) {
        var newHTML = '<tr>';
        newHTML += `<td class="city-name" index=${city.yearRank - 1}>${city.city}</td>`;
        newHTML += `<td class="city-state">${city.state}</td>`;
        newHTML += `<td class="city-directions"><button class="btn btn-primary">Get Directions</button></td>`;
        newHTML += `<td class="city-zoom"><button class="btn btn-success">Zoom to city</button></td>`;
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
            // set up a marker for current city
        var marker = new google.maps.Marker({
            // WHERE
            position: cityLL,
            map: map,
            title: city.city
        });
        // add a click listener to THIS marker
        // addListener takes 3 args:
        // 1. What
        // 2. Event
        // 3. Code to run...
        google.maps.event.addListener(marker, 'click', () => {
            // all infoWindows (becuase they are constructors), have a setContent
            // method which is like .html("blah blah blah")
            var infoWindowHTML = `<h2>${city.city}</h2>`
            infoWindowHTML += `<h4>City population: ${city.yearEstimate}</h4>`
            infoWindowHTML += '<img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Wonder_Woman_%28DC_Rebirth%29.jpg/170px-Wonder_Woman_%28DC_Rebirth%29.jpg">';
            infoWindow.setContent(infoWindowHTML);
            // open takes 2 args:
            // 1. Map to open the infoWindow on
            // 2. Where to put the infoWindow on teh map
            infoWindow.open(map, marker);
        })
        markers.push(marker);
    }
    // Lat/lon will correspond to one of our cities
    function zoomToCity(lat, lon) {
        // google maps api has a constructor to make a latlng object
        var LL = new google.maps.LatLng(lat, lon);
        console.log(LL);
        console.log(lat, lon);
        map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 15,
                center: LL
            }
        );
        infoWindow = new google.maps.InfoWindow();
        var places = new google.maps.places.PlacesService(map);
        // places has a method called "nearbySearch" that we pas an object with 
        // 1. location
        // 2. radius
        // 3. type
        places.nearbySearch({
            location: LL,
            radius: 500,
            type: ['stadium']

        }, function(results, status) {
            console.log(results);
        });
    }
});