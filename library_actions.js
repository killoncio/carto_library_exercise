var map = map || {};

map.actions = (function(){
	var MAP_LIBRARY;

	// I assume there is a better way to check this
	if (L && typeof L === 'object' && L.map && L.tileLayer) {
		MAP_LIBRARY = 'leaflet'
	}
	// todo: add checks for other libraries

	function create(mapOptions) {
		//todo: add checks and error messages for each of the params
		if (MAP_LIBRARY === 'leaflet') {
			return L.map(mapOptions.containerId).setView(mapOptions.center, mapOptions.zoom);
		}

		//todo: add actions for other libraries
	}

	function addLayer(templateUrl, options, map) {
		//todo: add checks and error messages for each of the params
		if (MAP_LIBRARY === 'leaflet') {
			L.tileLayer(templateUrl, options).addTo(map);
		}

		//todo: add actions for other libraries
	}

	return {
		create: create,
		addLayer: addLayer
	}
})();