function parse(configFile) {

	var layers = [];

	for (const layer of configFile.layers) { // ES6, no IE compatible
		var parsedLayer;

		if (layer.type === "tiled") {
			parsedLayer = {
				type: "http", // I dont know why, just that it is what the assignment says,
				urlTemplate: null,
				options: {}
			}

			// according to assignmet, we need to extract the url from the options object
			for (const key in layer.options) {
				if (key === "urlTemplate") {
					parsedLayer.urlTemplate = layer.options[key];
				} else {
					parsedLayer.options[key] = layer.options[key];
				}
			}

		}

	}

	layers.push(parsedLayer);

	return layers;

}

function render(layer, map) {
	L.tileLayer(layer.urlTemplate, layer.options).addTo(map);
}

export function renderLayers(configFile, map) {

	var layers = parse(configFile);

	for (layer of layers) {
		render(layer, map);
	}

}