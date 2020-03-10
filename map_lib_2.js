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
  contentType: 'application/x-www-form-urlencoded',
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