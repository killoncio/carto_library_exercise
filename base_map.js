function parse(configFile) {

	var mapConfig = {
		layers: []
	}


	for (const layer of configFile.layers) { // ES6, no IE compatible
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

export function renderInfo(configFile, map) {

	var layers = parse(configFile);

	var userName = configFile.maps_api_config.user_name

	$.ajax({
	  crossOrigin: true,
	  type: 'POST',
	  dataType: 'json',
	  contentType: 'application/json',
	  url: 'http://' + userName + '.cartodb.com/api/v1/map',
	  data: JSON.stringify(parse(configFile)),
	  success: function(data) {
	  	// This one, as the assignment says, does not work
		// var templateUrl = 'http://ashbu.cartocdn.com/' + userName + '/api/v1/map/' + data.layergroupid + '/1/{z}/{x}/{y}.png'
		// This one, as the documentation at https://carto.com/developers/maps-api/guides/quickstart/ says, works
	    var templateUrl = 'https://' + userName + '.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png' // dont understand what {x}/{y}/{z} is, just wrote 1 to try
	    console.log(templateUrl);
	    console.log(data);

	    // There is no map options in the config file. I assume we would use the same options for each layer.
	    // I have left them here hardcoded, but I assume I could just use the same from the other layer.
		L.tileLayer(templateUrl, {
		    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
		    minZoom:0,
		    maxZoom:18
		}).addTo(map);

	  }
	})

}