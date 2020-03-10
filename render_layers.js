var map = map || {};

map.renderLayer = (function() {
	function parseTiled(layer){
		var parsedLayer = {
			type: "http", // I dont know why, just that it is what the assignment says,
			urlTemplate: null,
			options: {}
		}

		// according to assignment, we need to extract the url from the options object
		for (const key in layer.options) {
			if (key === "urlTemplate") {
				parsedLayer.urlTemplate = layer.options[key];
			} else {
				parsedLayer.options[key] = layer.options[key];
			}
		}

		return parsedLayer;
	}

	function parseCarto(config){
		var mapConfig = {
			layers: []
		}

		for (const layer of config.layers) {
			var parsedLayer;

			if (layer.type === "tiled") {
				parsedLayer = {
					type: "http", // I dont know why, just that it is what the assignment says
					options: {
						urlTemplate: layer.options.urlTemplate
					}
				}
			} else if (layer.type === "CartoDB") {
				parsedLayer = {
					type: "mapnik", // I dont know why, just that it is what the assignment says
					options: layer.options
				}
				parsedLayer.options.interactivity = ["cartodb_id"] // I dont know why, just that it is what the assignment says
			}

			mapConfig.layers.push(parsedLayer);

		}

		return mapConfig;	
	}

	function render(layer, config, myMap){
		// This is a bit complex, but it seems for Carto we need to pass the info from all layers parsed in a way, while for tiled we need only
		// the specific layer info, parsed in a different way. I guess I am missing something, and this code could be done simpler
		if (layer.type === "tiled") {

			var parsedLayer = parseTiled(layer);

			map.actions.addLayer(parsedLayer.urlTemplate, parsedLayer.options, myMap);

		} else if (layer.type === "CartoDB") {

			var parsedLayer = parseCarto(config);
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
				map.actions.addLayer(templateUrl, options, myMap);
			  }
			});

		}
	}

	return render;
	
})();