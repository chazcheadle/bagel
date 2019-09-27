import 'ol/ol.css';
import {Map, View} from 'ol';

import {Draw, Modify, Snap} from 'ol/interaction.js';
import {transform} from 'ol/proj.js';
import Projection from 'ol/proj/Projection';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, TileWMS, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';



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

var openstreets = new TileLayer({
  source: new OSM()
});

// nys gis wms
// https://orthos.dhses.ny.gov/ArcGIS/services/Latest/MapServer/WMSServer?

const nysgis =
      new TileLayer({
        className: 'nysgis',
        visible: true,
        source: new TileWMS({
          url: 'https://orthos.dhses.ny.gov/ArcGIS/services/Latest/MapServer/WMSServer',
          params: {'FORMAT': 'image/jpeg', 
                   'VERSION': '1.3.0',
                   tiled: true,
                "LAYERS": '2',
             tilesOrigin: -74.02722 + "," + 40.684221
          }
        })
      });


const roads =
      new TileLayer({
        TRANSPARENT: true,
        className: 'roads',
        visible: true,
        source: new TileWMS({
          url: 'http://localhost:8080/geoserver/tiger/wms',
          params: {'FORMAT': 'image/jpeg', 
                   'VERSION': '1.1.1',
                   tiled: true,
                "LAYERS": 'tiger:tiger_roads',
                "exceptions": 'application/vnd.ogc.se_inimage',
                "TRANSPARENT": true,  
             tilesOrigin: -74.02722 + "," + 40.684221
          }
        })
      });

const map = new Map({
  target: 'map',
  // layers: [openstreets, roads, vector],
  layers: [nysgis, vector],
  view: new View({
    center: transform([-73.95, 41.425], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12,
    projection: 'EPSG:3857',
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


