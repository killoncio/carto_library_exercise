var map = map || {};

map.utils = (function() {
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

	return {
		parseTiled: parseTiled,
		parseCarto: parseCarto
	}
	
})();