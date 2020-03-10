// store locally global variable
var config 			= mapConfig;

var mapOptions = {
	containerId : 'map',
	center 		: JSON.parse(config.center) || [52.5897007687178, 52.734375],
	zoom 		: config.zoom || 4
}

var myMap = map.actions.create(mapOptions);

if (config.layers) {
	for (const layer of config.layers) {
		map.actions.add(layer,config,myMap);
	}
}

