import { map } from 'M/mapea';
import KML from 'M/layer/KML';
import template from '../development/templates/customKMLPopupTemplate.html'

const mapjs = map({
  container: 'map',
});

const LayerKml = new KML({
  url: 'http://mapea-sigc.juntadeandalucia.es/sepim_server/api/datos/kml/1193/item/341',
  name: 'capaKML',
  extract: true,
  template: template,
});

mapjs.addKML(LayerKml);

window.Layer = LayerKml;
