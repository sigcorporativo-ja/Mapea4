import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StylePoint from 'M/style/Point';
import StyleCluster from 'M/style/Cluster';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows',
  name: 'sepim:campamentos',
  legend: 'Campamentos',
  geometry: 'POINT',
  extract: true,
});

const styleBase = new StylePoint({
  radius: 5,
  fill: {
    color: 'yellow',
    opacity: 0.3,
  },
  stroke: {
    color: 'green',
  },
});

const styleCluster = new StyleCluster();

const composite = styleCluster.add(styleBase);

wfs.setStyle(composite);

// console.log(`StyleCluster tiene agregados los siguientes estilos:${styleCluster.getStyles()}`);

mapjs.addWFS(wfs);
