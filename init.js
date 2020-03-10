import * from './configFile.js';
import * from './render_layers.js';
import * from './base_map.js';

var mymap = L.map('map').setView([51.505, -0.09], 15);
var configFile = getConfigFile();
renderInfo(configFile, mymap);
renderLayers(configFile, mymap);