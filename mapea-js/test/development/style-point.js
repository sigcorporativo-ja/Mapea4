import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StylePoint from 'M/style/Point';
import * as form from 'M/style/Form';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const campamentos = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows',
  name: 'sepim:campamentos',
  legend: 'Campamentos',
  geometry: 'POINT',
  extract: true,
});

const stylepoint = new StylePoint({
  icon: {
    form: form.SQUARE,
    // form: form.CIRCLE,
    class: 'g-cartografia-bandera',
    fontsize: 0.5,
    radius: 15,
    color: 'red',
    // fill: 'black',
  },
});

campamentos.setStyle(stylepoint);
mapjs.addLayers([campamentos]);

window.mapjs = mapjs;
