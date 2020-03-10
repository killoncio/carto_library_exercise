// mapConfig is a global variable where config data is saved in config.js

var mapCenter 	= JSON.parse(mapConfig.center);
var mapZoom 	= mapConfig.zoom;

var mymap = L.map('map').setView(mapCenter, mapZoom);

cartoLayer.render(mapConfig, mymap);
mapLayers.render(mapConfig, mymap);