function onLoad() {
	var montreal = {lat: 45.5017, lng: -73.5673};
	var toronto = {lat: 43.652644, lng: -79.381769};

	var map = new google.maps.Map(document.getElementById('map'), {
		center: toronto,
		zoom: 13,
		mapTypeId: 'roadmap'
	});

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
	searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
	var places = searchBox.getPlaces();

	if (places.length == 0) {
	  return;
	}

	// Clear out the old markers.
	markers.forEach(function(marker) {
	  marker.setMap(null);
	});
	markers = [];

	// For each place, get the icon, name and location.
	var bounds = new google.maps.LatLngBounds();
	places.forEach(function(place) {
	console.log("Place", place);
	  if (!place.geometry) {
	    console.log("Returned place contains no geometry");
	    return;
	  }
	  getWeather(place.formatted_address);
	  $('.locale').text(place.name);
	  var icon = {
	    url: place.icon,
	    size: new google.maps.Size(71, 71),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(17, 34),
	    scaledSize: new google.maps.Size(25, 25)
	  };

	  // Create a marker for each place.
	  markers.push(new google.maps.Marker({
	    map: map,
	    icon: icon,
	    title: place.name,
	    position: place.geometry.location
	  }));

	  if (place.geometry.viewport) {
	    // Only geocodes have viewport.
	    bounds.union(place.geometry.viewport);
	  } else {
	    bounds.extend(place.geometry.location);
	  }
	});
	map.fitBounds(bounds);
	});
}

function addIcon(weather) {
	var div = document.getElementById('icons');
	var divChildren = div.childNodes; // get an array of child nodes

	// for loop to add hide to all div icons children

	for (var i=0; i<divChildren.length; i++) {
	    divChildren[i].className += " hide";
	}
	if ($('div.' + weather).hasClass('hide')) {
	  $('div.' + weather).removeClass('hide');
	}
}

function iconGen(weather) {
	console.log(weather);
	var weather = weather.toLowerCase();
	switch (weather) {
	  case 'drizzle':
	    addIcon(weather)
	    break;
	  case 'clouds':
	    addIcon(weather)
	    break;
	  case 'fog':
	    addIcon(weather)
	    break;
	  case 'haze':
	    addIcon(weather)
	    break;
	  case 'rain':
	    addIcon(weather)
	    break;
	  case 'snow':
	    addIcon(weather)
	    break;
	  case 'clear':
	    addIcon(weather)
	    break;
	  case 'mist':
	    addIcon(weather)
	    break;
	  case 'thunderstorm':
	    addIcon(weather)
	    break;
	  default:
	    console.log("defaulting");
	    $('div.clouds').removeClass('hide');
	}
}

function getWeather(city) {
	console.log(city);

	var weatherKey = "3d116075e0fe88576d7d105ffb94897e";
	var weatherApiLink = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherKey;

	$.getJSON(weatherApiLink, function(response) {
	  // need some error handling...
	  var theWeather = response.weather[0].main;
	  iconGen(theWeather);

	  var theDescription = response.weather[0].description;
	  function capitalizeFirst(string) {
	      var newDesc = string.charAt(0).toUpperCase() + string.slice(1);
	      $('.detail-description').text(newDesc);
	  }
	  capitalizeFirst(theDescription);

	  var tempCel = ((response.main.temp - 273.15).toFixed(2) + " °C");
	  var tempFar = ((( response.main.temp - 273.15) * 9/5) + 32).toFixed(2) + " °F";
	  //countries where farhenheit
	  // if (country === "US" ||
	  //     country === "BZ" ||
	  //     country === "KY" ||
	  //     country === "GU" ||
	  //     country === "PR" ||
	  //     country === "PW" ||
	  //     country === "VA") 
	  // {
	  //   $('.temps').text(tempFar);  
	  // }
	  // else {
	  //   $('.temps').text(tempCel);
	  // }
	  $('.temps').text(tempCel);
	  $('.weather-data').removeClass('hide');
	  // ***
	  // sun-data
	  // ***
	  var parsedSunriseHours = new Date(response.sys.sunrise*1000).getHours();
	    if (parsedSunriseHours < 10) {
	      parsedSunriseHours = "0" + parsedSunriseHours;
	    }
	  var parsedSunriseMins = new Date(response.sys.sunrise*1000).getMinutes();
	    if (parsedSunriseMins < 10) {
	      parsedSunriseMins = "0" + parsedSunriseMins;
	    }
	  var parsedSunsetHours = new Date(response.sys.sunset*1000).getHours();
	    if (parsedSunsetHours < 10) {
	      parsedSunsetHours = "0" + parsedSunsetHours;
	    }
	  var parsedSunsetMins = new Date(response.sys.sunset*1000).getMinutes();
	    if (parsedSunsetMins < 10) {
	      parsedSunsetMins = "0" + parsedSunsetMins;
	    }
	  var formatSunrise = parsedSunriseHours + ":" + parsedSunriseMins;
	  var formatSunset = parsedSunsetHours + ":" + parsedSunsetMins; 
	  // Next: Make accept other time zones

	  $('.sunrise').text(formatSunrise);
	  $('.sunset').text(formatSunset);
	  $('.sun-data').removeClass('hide');
	  });
}


// to do

// make search box start left. right now noticeable lag
//geolocation
// celcius farhenheit
// proper time zones
// idea: find language of searched country, return translated data (and can toggle lang)
