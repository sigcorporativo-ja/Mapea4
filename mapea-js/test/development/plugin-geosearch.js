import Geosearch from 'plugins/geosearch/facade/js/geosearch';

const mapjs = M.map({ container: 'map' });

const plugin = new Geosearch({});

const layer = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows',
  name: 'sepim:campamentos',
  legend: 'Campamentos',
  geometry: 'POINT',
  extract: true,
});

const estiloPunto = new M.style.Point({
  icon: {
    // form: M.style.form.NONE, // --> NO FUNCIONA
    form: M.style.form.CIRCLE,
    class: 'g-cartografia-bandera',
    fontsize: 0.5,
    radius: 15,
    // color: '#ff0000', // -->NO FUNCIONA
    fill: 'white', // --> SI SE QUITA NO FUNCIONA
  },
});

mapjs.addPlugin(plugin);
layer.setStyle(estiloPunto);
mapjs.addLayers(layer);

window.plugin = plugin;
window.mapjs = mapjs;
