import { map as Mmap } from 'M/mapea';
import { info } from 'M/dialog';
import WMC from 'M/layer/WMC';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';
import Mapbox from 'M/layer/Mapbox';
import OSM from 'M/layer/OSM';

const mapjs = Mmap({
  container: 'map',
  layers: ['OSM'],
  controls: ['mouse', 'layerswitcher'],
});

window.mapjs = mapjs;

// capa1 ---> extent
// const capaExtent =
// capa2 ---> capabilities
// capa3 ---> wmc
// capa4 ---> wmcglobal
// capa5 ---> projection

// quitar/poner maxextent a capa
// quitar/poner maxextent a mapa
// cargar/quitar wmc
const maxExtent = [193104.52926740074, 4119420.5399687593, 287161.9825899291, 4164759.1717656343];
const wmc = new WMC('http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/wmcprueba.xml*prueba');
const permeabilidad = new WMS('WMS*permeabilidad*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?*permeabilidad');
const redesEnergeticas = new WMS('WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true');
const limites = new WMS('WMS*Limites*https://www.ideandalucia.es/wms/mta10v_2007?*Limites*true');
const canarias = new WMS('WMS*canarias*http://idecan2.grafcan.es/ServicioWMS/MOS?*WMS_MOS*true*false');
const toporaster = new WMTS('WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster');
const mapbox = new Mapbox('MAPBOX*mapbox.streets*true');
const osm = new OSM({ transparent: true });

const removeLayers = () => mapjs.removeLayers(mapjs.getLayers());

window.prioridadCapa = (evt) => {
  info(`
    Añadimos una WMS con un maxExtent por parámetro.
  `);
  const permeabilidadExtent = new WMS({
    // url: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?", name: "permeabilidad",
    url: 'http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_zona_peligro_incendios_forestales?',
    name: 'REDIAM',
    maxExtent,
  });
  mapjs.addWMS(permeabilidadExtent);
};

window.prioridadWMC = (evt) => {
  info(`
    Cargamos el WMC de CDAU con el maxExtent global (Andalucía) y con la capa base con un maxExtent específico,
    en este caso, mayor que el global.
  `);
  removeLayers();
  const wmctmp = new WMC('http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/wmcprueba.xml*prueba');
  mapjs.setBbox([74122.81076839779, 4046156.547951491, 454654.1962325135, 4239791.528992346]);
  mapjs.setMaxExtent(undefined);
  mapjs.addWMC(wmctmp);
};
window.prioridadMapa = (evt) => {
  info(`
    3. Parámetro mapa: Si el usuario especifica un maxExtent en el mapa entonces éste será aplicado a la capa.
  `);
  removeLayers();
  mapjs.setMaxExtent(maxExtent);
  mapjs.addLayers([wmc, permeabilidad, redesEnergeticas, limites, toporaster, mapbox, osm]);
};
window.prioridadGetCapabilities = (evt) => {
  info(`
    5. GetCapabilities: Si es una capa WMS o WMTS, se establecerá el maxExtent especificado en el GetCapabilities del servicio.
  `);
  removeLayers();
  mapjs.setProjection('EPSG:25830*m');
  mapjs.addControls(['layerswitcher', 'mouse']);
  mapjs.addLayers([redesEnergeticas, limites, toporaster, canarias]);
};
window.prioridadProyeccion = (evt) => {
  info(`
    6. Proyección: Se aplicará el maxExtent de la proyección que tenga establecida el mapa teniendo en cuenta que ésta puede estar establecida a su vez por el WMC.
  `);
  removeLayers();
  mapjs.addLayers([mapbox, osm]);
};
