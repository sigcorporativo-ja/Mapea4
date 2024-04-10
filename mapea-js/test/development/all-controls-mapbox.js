import { map } from 'M/mapea';
import MAPBOX from 'M/layer/Mapbox';


const mapjs = map({
  container: 'map',
  controls: ['scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'overviewmap', 'location'],
  getfeatureinfo: 'plain',
  // layers: ['MAPBOX*mapbox.satellite'],
  projection: 'EPSG:3857*m',
});
window.map = mapjs;

const mapboxLayer = new MAPBOX(
  'MAPBOX*mapbox.satellite',
  // {},
  // {
  //   tileLoadFunction: function(imageTile, src) {
  //     imageTile.getImage().src = src;
  //     console.log('tile cargada mapbox');
  //   } 
  // }
);

mapjs.addLayers([mapboxLayer]);