import M from 'facade/js/Mapea';
import Panel from "facade/js/ui/Panel";

const map = M.map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
  getfeatureinfo: 'plain',
  controls: ["scale", "scaleline", "panzoombar", "panzoom", "layerswitcher", "mouse", "overviewmap", "location"]
});

window.map = map;
