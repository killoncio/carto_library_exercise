var mymap = L.map('map').setView([51.505, -0.09], 15);


var mapConfig = {
	layers: []
}

var layerNumber = 1;
var nav = $("#nav");

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

	nav.append("<li class='js-apply_layer' data-index='" + (layerNumber - 1) + "'>Layer " + layerNumber + "</li>");

	layerNumber++;

}

nav.on('click','li',onClick);

function onClick(e){
	var index = $(e.target).data('index');
	var layer = mapConfig.layers[index];

	if (layer.type === "http") {

	}


	L.tileLayer(templateUrl, layer.options).addTo(mymap);
}

var userName = configFile.maps_api_config.user_name

$.ajax({
  crossOrigin: true,
  type: 'POST',
  dataType: 'json',
  contentType: 'application/json',
  url: 'http://' + userName + '.cartodb.com/api/v1/map',
  data: JSON.stringify(mapConfig),
  success: function(data) {
  	// This one, as the assignment says, does not work
	// var templateUrl = 'http://ashbu.cartocdn.com/' + userName + '/api/v1/map/' + data.layergroupid + '/1/{z}/{x}/{y}.png'
	// This one, as the documentation at https://carto.com/developers/maps-api/guides/quickstart/ says, works
    var templateUrl = 'https://' + userName + '.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png' // dont understand what {x}/{y}/{z} is, just wrote 1 to try
    console.log(templateUrl);
    console.log(data);

	L.tileLayer(templateUrl, {
	    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
	    minZoom:0,
	    maxZoom:18
	}).addTo(mymap);

  }
})

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
    minZoom:0,
    maxZoom:18
}).addTo(mymap);

L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
    minZoom:0,
    maxZoom:18
}).addTo(mymap);