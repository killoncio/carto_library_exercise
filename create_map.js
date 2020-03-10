var map = map || {};

map.actions = (function(){

	var init = function(options) {
		var library = options.library || 'leaflet';

		return {
			create: map[library].create,
			addLayer: map[library].addLayer
		}
 
	}

	var create = function(options) {
		// giving some random default values
		var library = options.library || 'leaflet';
		var id = options.containerId || 'map';
		var center = options.center || [52.5897007687178, 52.734375];
		var zoom = options.zoom || 4;

		var api = map[library];

		api.create();

			// a better solution would be to call a module e.g. "'load_' + options.library", 
			// In that way, the code in this file does not have to be modified everytime a new library is supported
			L.map(id).setView(center, zoom);
		} else {
			//todo: add support for other libraries
			console.log('sorry, we do not have support for that library yet');
		}
	}

	var addLayer = function() {
		api.addLayer();
	}

	return create;

}());