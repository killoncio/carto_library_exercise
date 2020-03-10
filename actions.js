// Here we abstract the different libraries actions into a single API
// So far there is only calls for Leaflet. The idea is to add more in the future.


var map = map || {};

map.actions = (function(){
	var MAP_LIBRARY;

	// I assume there is a better way to check this
	if (L && typeof L === 'object' && L.map && L.tileLayer) {
		MAP_LIBRARY = 'leaflet'
	}

	function create(mapOptions) {
		//todo: add checks and error messages for each of the params
		if (MAP_LIBRARY === 'leaflet') {
			return L.map(mapOptions.containerId).setView(mapOptions.center, mapOptions.zoom);
		}
	}

	function addLayer(templateUrl, options, map) {
		//todo: add checks and error messages for each of the params
		if (MAP_LIBRARY === 'leaflet') {
			L.tileLayer(templateUrl, options).addTo(map);
		}
	}

	function add(layer, config, myMap){
		// This is a bit complex, but it seems for Carto we need to pass the info from all layers parsed in a way, while for tiled we need only
		// the specific layer info, parsed in a different way. I guess I am missing something, and this code could be done simpler
		if (layer.type === "tiled") {

			var parsedLayer = map.utils.parseTiled(layer);

			addLayer(parsedLayer.urlTemplate, parsedLayer.options, myMap);

		} else if (layer.type === "CartoDB") {

			var parsedLayer = map.utils.parseCarto(config);
			var userName = config.maps_api_config.user_name;
			// not sure why, but in the config there are no options for cartoDB. For what I see, i need it. I'll hardcode it for now.
			var options = {
				"minZoom":"0",
        		"maxZoom":"18",
        		"attribution":"&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
      		}

			$.ajax({
			  crossOrigin: true,
			  type: 'POST',
			  dataType: 'json',
	  		  contentType: 'application/json',
			  url: 'http://' + userName + '.cartodb.com/api/v1/map',
			  data: JSON.stringify(parsedLayer),
			  success: function(data) {
			  	// This one, as the assignment says, does not work
				// var templateUrl = 'http://ashbu.cartocdn.com/' + userName + '/api/v1/map/' + data.layergroupid + '/1/{z}/{x}/{y}.png'
				// This one, as the documentation at https://carto.com/developers/maps-api/guides/quickstart/ says, works
			    var templateUrl = 'https://' + userName + '.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png' // dont understand what {x}/{y}/{z} is, just wrote 1 to try

			    // There is no map options in the config file. I assume we would use the same options for each layer.
			    // I have left them here hardcoded, but I assume I could just use the same from the other layer.
				addLayer(templateUrl, options, myMap);
			  }
			});

		}
	}


	return {
		create: create,
		addLayer: addLayer,// right now it is not needed to be public, but I think in the future could be beneficial
		add: add
	}
})();