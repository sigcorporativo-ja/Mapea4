import { map as Mmap } from 'M/mapea';
import Location from 'M/control/Location';
import Mouse from 'M/control/Mouse';
import OverviewMap from 'M/control/OverviewMap';
import Panzoom from 'M/control/Panzoom';
import Panzoombar from 'M/control/Panzoombar';
import ScaleLine from 'M/control/ScaleLine';
import Feature from 'M/feature/Feature';
import GeoJSON from 'M/layer/GeoJSON';
import KML from 'M/layer/KML';
import Mapbox from 'M/layer/Mapbox';
import OSM from 'M/layer/OSM';
import Vector from 'M/layer/Vector';
import WFS from 'M/layer/WFS';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';
import Popup from 'M/Popup';
// import View from 'M/impl/View';

import Panel from 'M/ui/Panel';
import * as Position from 'M/ui/position';

import OLSourceVector from 'ol/source/Vector';
import OLSourceXYZ from 'ol/source/XYZ';
import { get as getProj } from 'ol/proj';

let osmLayer = new OSM();
let mapboxLayer;
const mapjs = Mmap({
  container: 'map',
  layers: [osmLayer],
  controls: ["layerswitcher"],
  projection: 'EPSG:3857*m'
});

window.vendorLocation = (evt) => {
  if (window.confirm(`
    {
      tracking: false,
      trackingOptions: {
        enableHighAccuracy: true,
        timeout: 100,
        maximumAge: 15
      },
    }
  `)) {
    const locationCtrl = new Location(true, false, {
      tracking: false,
      trackingOptions: {
        enableHighAccuracy: true,
        timeout: 100,
        maximumAge: 15
      },
    });
    const locationPanel = new Panel(Location.NAME, {
      collapsible: false,
      className: 'm-location',
      position: Position.BR,
    });
    locationPanel.addControls(locationCtrl);
    mapjs.addPanels(locationPanel);
  }
};

window.vendorGeoJSON = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        opacity: 0.1,
        source: new OLSourceVector({
          attributions: 'geojson de mapea'
        })
      }
  `)) {
    const geoJSON = new GeoJSON({
      name: "Ayuntamientos",
      url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=mapea:assda_sv10_ayuntamiento_point_indicadores&outputFormat=application/json"
    }, undefined, {
      opacity: 0.1,
      source: new OLSourceVector({
        attributions: 'geojson de mapea',
      })
    });
    mapjs.addLayers(geoJSON);
  }
};

window.vendorKML = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        opacity: 0.3,
        source: new OLSourceVector({
          loader: (bbox, resolution, projection) => {
            alert(cargar datos en la resolución resolution);
            return (data) => console.log(data);
          }
        })
      }
  `)) {
    const kml = new KML({
      name: 'arbda_sing_se',
      url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
      extract: false
    }, undefined, {
      opacity: 0.3,
      source: new OLSourceVector({
        loader: (bbox, resolution, projection) => {
          alert(`cargar datos en la resolución ${resolution}`);
          return (data) => console.log(data);
        }
      })
    });
    mapjs.addLayers(kml);
  }
};

window.vendorMapbox = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        preload: 2,
        source: new OLSourceXYZ({
          attributions: 'prueba mapea mapbox',
          url: 'https://api.mapbox.com/v4/mapbox.pirates/8/123/99.png?access_token=pk.eyJ1Ijoic2lnY29ycG9yYXRpdm9qYSIsImEiOiJjaXczZ3hlc2YwMDBrMm9wYnRqd3gyMWQ0In0.wF12VawgDM31l5RcAGb6AA',
        }),
      }
  `)) {
    mapboxLayer = new Mapbox({
      name: 'mapbox.pirates',
    }, undefined, {
      preload: 2,
      source: new OLSourceXYZ({
        attributions: 'prueba mapea mapbox',
        url: 'https://api.mapbox.com/v4/mapbox.pirates/8/123/99.png?access_token=pk.eyJ1Ijoic2lnY29ycG9yYXRpdm9qYSIsImEiOiJjaXczZ3hlc2YwMDBrMm9wYnRqd3gyMWQ0In0.wF12VawgDM31l5RcAGb6AA',
      }),
    });
    mapjs.removeLayers([osmLayer]);
    mapjs.addLayers(mapboxLayer);
  }
};

window.vendorOSM = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        preload: 2,
        source: new OLSourceXYZ({
          attributions: 'osm de mapea',
          url: 'https://b.tile.openstreetmap.org/11/989/794.png',
        })
      }
  `)) {
    if (osmLayer) mapjs.removeLayers([osmLayer]);
    osmLayer = new OSM('OSM', undefined, {
      preload: 2,
      source: new OLSourceXYZ({
        attributions: 'osm de mapea',
        url: 'https://b.tile.openstreetmap.org/11/989/794.png',
      })
    });
    if (mapboxLayer) mapjs.removeLayers([mapboxLayer]);
    mapjs.addLayers(osmLayer);
  }
};

window.vendorVector = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        opacity: 0.8,
        source: new OLSourceVector({
          attributions: 'prueba de mapea'
        })
      }
  `)) {
    const vector = new Vector({}, undefined, undefined, {
      opacity: 0.8,
      source: new OLSourceVector({
        attributions: 'capa vector'
      })
    });
    mapjs.addLayers(vector);
  }
};

window.vendorWFS = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
    {
      updateWhileAnimating: true,
      updateWhileInteracting: true
    }
  `)) {
    const wfs = new WFS({
      url: "http://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
      namespace: "callejero",
      name: "prueba_pol_wfst",
      legend: "Edicion",
      geometry: 'MPOLYGON'
    }, undefined, {
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });
    mapjs.addLayers(wfs);
  }
};

window.vendorWMS = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        visible: true,
        opacity: 0.3
      }
  `)) {
    const wms = new WMS("WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true", undefined, {
      visible: true,
      opacity: 0.5
    });
    mapjs.addLayers(wms);
  }
};

window.vendorWMTS = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        visible: false,
      }
  `)) {
    const wmts = new WMTS("WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster", undefined, {
      visible: false,
    });
    mapjs.addLayers(wmts);
  }
};

window.vendorMouse = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        projection: getProj('EPSG:4326'),
        undefinedHTML: 'sin valor',
        coordinateFormat: (coord) => "x: \${coord[0]} | y: \${coord[1]}"
      }
  `)) {
    const mouse = new Mouse({
      projection: getProj('EPSG:4326'),
      undefinedHTML: 'sin valor',
      coordinateFormat: (coord) => `x: ${coord[0]} | y: ${coord[1]}`
    });
    let panel = mapjs.getPanels('map-info')[0];
    if (!panel) {
      panel = new Panel('map-info', {
        collapsible: false,
        className: 'm-map-info',
        position: Position.BR,
        tooltip: 'Coordenadas del puntero',
      });
      panel.addControls(mouse);
      mapjs.addPanels(panel);
    }
    else {
      panel.addControls(mouse);
    }
    panel.addClassName('m-with-mouse');
  }
};

window.vendorOverviewMap = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        collapsed: false,
        tipLabel: 'prueba de tip label',
        label: 'prueba de label',
        collapseLabel: 'esto es el label de colapsar'
      }
  `)) {
    const overviewmap = new OverviewMap({ toggleDelay: 400 }, {
      collapsed: false,
      tipLabel: 'prueba de tip label',
      label: 'prueba de label',
      collapseLabel: 'esto es el label de colapsar'
    });
    let panel = mapjs.getPanels('map-info')[0];
    if (!panel) {
      panel = new Panel('map-info', {
        collapsible: false,
        className: 'm-map-info',
        position: Position.BR,
      });
      panel.addControls(overviewmap);
      mapjs.addPanels(panel);
    }
    else {
      panel.addControls(overviewmap);
    }
    panel.addClassName('m-with-overviewmap');
  }
};

window.vendorPanzoom = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        duration: 1000,
        zoomInLabel: '*',
        zoomOutLabel: ':',
        zoomInTipLabel: 'aumenta zoom prueba',
        zoomOutTipLabel: 'disminuye zoom prueba'
      }
  `)) {
    const panzoom = new Panzoom({
      duration: 1000,
      zoomInLabel: '*',
      zoomOutLabel: ':',
      zoomInTipLabel: 'aumenta zoom prueba',
      zoomOutTipLabel: 'disminuye zoom prueba'
    });
    const panel = new Panel('map-zoom', {
      collapsible: false,
      className: 'm-panzoom',
      position: Position.TL,
    });
    panel.addControls(panzoom);
    mapjs.addPanels(panel);
  }
};

window.vendorPanzoombar = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        duration: 1000
      }
  `)) {
      const panzoombar = new Panzoombar({
        duration: 1000
      });
      const panel = new Panel('map-panzoombar', {
        collapsible: false,
        className: 'm-panzoombar',
        position: Position.TL,
        tooltip: 'Nivel de zoom',
      });
      panel.addControls(panzoombar);
      mapjs.addPanels(panel);
    }
};

window.vendorScaleLine = (evt) => {
  if (window.confirm(`
    Se incluyen los siguientes parámetros vendor:
      {
        minWidth: 640,
      }
  `)) {
      const scaleline = new ScaleLine({
        minWidth: 640,
      });
      const panel = new Panel('map-scaleline', {
        collapsible: false,
        className: 'm-scaleline',
        position: Position.BL,
        tooltip: 'Línea de escala',
      });
      panel.addControls(scaleline);
      mapjs.addPanels(panel);
    }
};



