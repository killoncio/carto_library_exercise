var mymap = L.map('map').setView([51.505, -0.09], 15);

var configFile = {
  "center":"[52.5897007687178, 52.734375]",
  "zoom":4,
  "maps_api_config": {
    "user_name": "documentation",
    "maps_api_template": "http://{user}.cartodb.com:80"
  },
  "layers":[
    {
      "type":"tiled",
      "options":{     
      	"urlTemplate":"http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "minZoom":"0",
        "maxZoom":"18",
        "attribution":"&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
      }
    },
    {
      "type":"CartoDB",
      "options":{
        "sql":"select * from european_countries_e",
        "cartocss":"/** choropleth visualization */\n\n#european_countries_e{\n  polygon-fill: #FFFFB2;\n  polygon-opacity: 0.8;\n  line-color: #FFF;\n  line-width: 1;\n  line-opacity: 0.5;\n}\n#european_countries_e [ area <= 1638094] {\n   polygon-fill: #B10026;\n}\n#european_countries_e [ area <= 55010] {\n   polygon-fill: #E31A1C;\n}\n#european_countries_e [ area <= 34895] {\n   polygon-fill: #FC4E2A;\n}\n#european_countries_e [ area <= 12890] {\n   polygon-fill: #FD8D3C;\n}\n#european_countries_e [ area <= 10025] {\n   polygon-fill: #FEB24C;\n}\n#european_countries_e [ area <= 9150] {\n   polygon-fill: #FED976;\n}\n#european_countries_e [ area <= 5592] {\n   polygon-fill: #FFFFB2;\n}",
        "cartocss_version":"2.1.1"
      }
    },
    {
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        "minZoom": "0",
        "maxZoom": "18",
        "attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
      },
      "type": "tiled"
    }
  ],
}

var mapConfig = {
	layers: []
}

var layerNumber = 1;
var nav = $("#nav");

if (!configFile || !configFile.layers) {
	console.log('You need to provide a config file object, which should have a property called "layers" with the data needed');
}

if (!configFile.maps_api_config || !configFile.maps_api_config.user_name) {
	console.log('Your config file object needs to have as "maps_api_config" property an object which will have the username stored in its user_name property');
}

var userName = configFile.maps_api_config.user_name;

for (const layer of configFile.layers) { // ES6, no IE compatible

	if (layer.type === "CartoDB") {

		var parsedLayer = {
			type: "mapnik", // I dont know why, just that it is what the assignment says
			options: layer.options,
		}

		parsedLayer.options.interactivity = ["cartodb_id"] // I dont know why, just that it is what the assignment says

		$.ajax({
		  crossOrigin: true,
		  type: 'POST',
		  dataType: 'json',
		  contentType: 'application/json',
		  url: 'http://' + userName + '.cartodb.com/api/v1/map',
		  data: JSON.stringify(parsedLayer.options),
		  success: function(data) {
		  	// This one, which is the one the assignment says we have to use, does not work
			// var templateUrl = 'http://ashbu.cartocdn.com/' + userName + '/api/v1/map/' + data.layergroupid + '/1/{z}/{x}/{y}.png'

			// This one, as the documentation at https://carto.com/developers/maps-api/guides/quickstart/ says, does work
		    var templateUrl = 'https://' + userName + '.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png' // dont understand what {x}/{y}/{z} is, just wrote 1 to try
		    console.log(templateUrl);
		    console.log(data);

			L.tileLayer(templateUrl, parsedLayer.options).addTo(mymap);

		  }
		});

	} else if (layer.type === "tiled") {

		var parsedLayer = {
			type: "http", // I dont know why, just that it is what the assignment says
			options:{}
		}

		// according to assignmet, we need to extract the url from the options object
		for (const key in layer.options) {
			if (key === "urlTemplate") {
				parsedLayer.urlTemplate = layer.options[key];
			} else {
				parsedLayer.options[key] = layer.options[key];
			}
		}

		// L.tileLayer(parsedLayer.urlTemplate, parsedLayer.options).addTo(mymap);

	}

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