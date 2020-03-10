// store locally global variable
var config 			= mapConfig;

var mapOptions = {
	containerId : 'map',
	center 		: JSON.parse(config.center) || [52.5897007687178, 52.734375],
	zoom 		: config.zoom || 4
}

var myMap = map.actions.create(mapOptions);

for (const layer of config.layers) {
	map.renderLayer(layer,config,myMap);
}