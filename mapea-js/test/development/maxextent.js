import { map as Mmap } from 'M/mapea';
import { info } from 'M/dialog';
import WMC from 'M/layer/WMC';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';
import Mapbox from 'M/layer/Mapbox';
import OSM from 'M/layer/OSM';

const mapjs = Mmap({
  container: 'map',
  layers: ["OSM"]
});

window.mapjs = mapjs;

const maxExtent = [193104.52926740074, 4119420.5399687593, 287161.9825899291, 4164759.1717656343];
const wmcPrioridadCapa = new WMC("http://TODO.com/files*prioridadcapa");
const wmcPrioridadGlobal = new WMC("http://TODO.com/files*prioridadglobal");
const permeabilidad = new WMS("http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?*permeabilidad");
const redesEnergeticas = new WMS("WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true");
const limites = new WMS("WMS*Limites*http://www.ideandalucia.es/wms/mta10v_2007?*Limites*true");
const canarias = new WMS("WMS*canarias*http://idecan2.grafcan.es/ServicioWMS/MOS?*WMS_MOS*true*false");
const toporaster = new WMTS("WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster");
const mapbox = new Mapbox("MAPBOX*mapbox.streets*true");
const osm = new OSM();

const removeLayers = () => mapjs.removeLayers(mapjs.getLayers());

window.prioridadCapa = (evt) => {
  info(`
    1. Parámetro capa: Si el usuario especifica un maxExtent en los parámetros de la capa éste será aplicado sobre la misma:
    const permeabilidad = new WMS({
      url: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?",
      name: "permeabilidad",
      maxExtent: [${maxExtent}]
    });
  `);
  const permeabilidadExtent = new WMS({
    url: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?",
    name: "permeabilidad",
    maxExtent
  });
  mapjs.addWMS(permeabilidadExtent);
};

window.prioridadWMC = (evt) => {
  info(`
    2. WMC: Si la capa es una WMS o WMTS que proviene de un WMC, se establecerá el maxExtent que tenga definido esta capa en dicho WMC.
  `);
  removeLayers();
  mapjs.addWMC(wmcPrioridadCapa);
};
window.prioridadMapa = (evt) => {
  info(`
    3. Parámetro mapa: Si el usuario especifica un maxExtent en el mapa entonces éste será aplicado a la capa.
  `);
  removeLayers();
  mapjs.setMaxExtent(maxExtent);
  mapjs.addLayers([wmcPrioridadGlobal, permeabilidad, redesEnergeticas, limites, toporaster, mapbox, osm]);
};
window.prioridadWMCGlobal = (evt) => {
  info(`
    4. WMC global: Si no posee ningún maxExtent propio se hará uso del maxExtent global definido en ese mismo WMC.
  `);
  const wmcPrioridadGlobal = new WMC("http://TODO.com/files*prioridadglobal");
  removeLayers();
  mapjs.addWMC(wmcPrioridadGlobal);
};
window.prioridadGetCapabilities = (evt) => {
  info(`
    5. GetCapabilities: Si es una capa WMS o WMTS, se establecerá el maxExtent especificado en el GetCapabilities del servicio.
  `);
  removeLayers();
  mapjs.setProjection("EPSG:32628*m");
  mapjs.addControls(["layerswitcher", "mouse"]);
  mapjs.addLayers([redesEnergeticas, limites, toporaster, canarias]);
};
window.prioridadProyeccion = (evt) => {
  info(`
    6. Proyección: Se aplicará el maxExtent de la proyección que tenga establecida el mapa teniendo en cuenta que ésta puede estar establecida a su vez por el WMC.
  `);
  removeLayers();
  mapjs.addLayers([mapbox, osm]);
};