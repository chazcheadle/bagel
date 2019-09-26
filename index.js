import 'ol/ol.css';
import {Map, View} from 'ol';

import {Draw, Modify, Snap} from 'ol/interaction.js';
import {transform} from 'ol/proj.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';


var raster = new TileLayer({
  source: new OSM()
});

var source = new VectorSource();
var vector = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#14771d',
      width: 2
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#14771d'
      })
    })
  })
});

const map = new Map({
  target: 'map',
  layers: [raster, vector],
  view: new View({
    center: transform([-73.95, 41.425], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12
  })
});
// map.setCenter(  new OpenLayers.LonLat(-73.95, 41.425).transform(proj, map.getProjectionObject()), 12);


var modify = new Modify({source: source});
map.addInteraction(modify);

var draw, snap; // global so we can remove them later
var typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new Draw({
    source: source,
    type: typeSelect.value
  });
  map.addInteraction(draw);
  snap = new Snap({source: source});
  map.addInteraction(snap);

}

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();