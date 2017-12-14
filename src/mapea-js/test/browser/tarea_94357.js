let mapajs = M.map({
  container: "map",
  controls: ['layerswitcher', 'overviewmap', "mouse"],
  projection: "EPSG:4326*d",
  layers: ["OSM"],
  center: [-4, 40],
  zoom: 4
});

let vector = new M.layer.Vector({
  name: "vector",
});

let features = [];

for (let i = 0; i < 100; i++) {
  let feature = new M.Feature(`${i}`, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [Math.random() * (-8), 36 + Math.random() * 3]
    },
    "properties": {}
  });
  features.push(feature);
};

vector.addFeatures(features);

let wfs = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda",
  legend: "centrosassda",
  getfeatureinfo: "plain",
  geometry: 'POINT',
});

let geojson = new M.layer.GeoJSON({
  name: "geojson",
  source: {
    "type": "FeatureCollection",
    "features": []
  }
});

let features2 = [];
for (let i = 0; i < 100; i++) {
  let feature = new M.Feature(`${i}`, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [Math.random() * (-8), 36 + Math.random() * 3]
    },
    "properties": {}
  });
  features2.push(feature);
};

geojson.on(M.evt.LOAD, () => geojson.addFeatures(features2));

const querySelector = document.querySelector;

const vectorElements = {
  "panel": document.querySelector('.vector'),
  "solapa": document.querySelector('.vector .solapa'),
  "toggle": document.querySelector('.vector .toggle-layer')
}

const geojsonElements = {
  "panel": document.querySelector('.geojson'),
  "solapa": document.querySelector('.geojson .solapa'),
  "toggle": document.querySelector('.geojson .toggle-layer')
}

const wfsElements = {
  "panel": document.querySelector('.wfs'),
  "solapa": document.querySelector('.wfs .solapa'),
  "toggle": document.querySelector('.wfs .toggle-layer')
}

const toggleHandler = (element) => {
  return () => {

    if (element.parentElement.getAttribute("opened") === "true") {
      element.parentElement.removeAttribute("opened");
      element.firstElementChild.innerText = "Mostrar"
    }
    else {
      element.parentElement.setAttribute("opened", "true");
      element.firstElementChild.innerText = "Ocultar"
    }
  }
};

const toggleLayer = (layer, element) => {
  return () => {
    if (element.getAttribute("added") === "true") {
      element.removeAttribute("added");
      element.innerText = "Añadir capa"
      mapajs.removeLayers(layer);
    }
    else {
      const load = () => {
        element.setAttribute("added", "true");
        element.innerText = "Eliminar capa";
      };
      if (layer instanceof M.layer.GeoJSON || layer instanceof M.layer.WFS) {
        layer.on(M.evt.LOAD, load);
      }
      else {
        load();
      }
      mapajs.addLayers(layer);

    }
  }
}

const functions = {
  setStyle: (layer) => {
    layer.setStyle(new M.style.Point({
      fill: {
        color: 'red'
      },
      radius: 12
    }));
  },
  setStyleTrue: (layer) => {
    layer.setStyle(new M.style.Point({
      fill: {
        color: 'black'
      },
      radius: 12
    }), true);
  },
  clearStyle: (layer) => {
    layer.clearStyle();
  },
  setStyleNull: (layer) => {
    layer.setStyle(null);
  },
  setStyleNullTrue: (layer) => {
    layer.setStyle(null, true);
  },
  featureStyle: (layer) => {
    layer.getFeatures().slice(0, 20).forEach(f => f.setStyle(new M.style.Point({
      fill: {
        color: 'yellow'
      },
      radius: 18
    })));
  },
  featureClear: (layer) => {
    layer.getFeatures().slice(0, 20).forEach(f => f.clearStyle());
  },
  featureStyleNull: (layer) => {
    layer.getFeatures().slice(0, 20).forEach(f => f.setStyle(null));
  }

}

vectorElements.solapa.onclick = toggleHandler(vectorElements.solapa);
wfsElements.solapa.onclick = toggleHandler(wfsElements.solapa);
geojsonElements.solapa.onclick = toggleHandler(geojsonElements.solapa);

vectorElements.toggle.onclick = toggleLayer(vector, vectorElements.toggle);
wfsElements.toggle.onclick = toggleLayer(wfs, wfsElements.toggle);
geojsonElements.toggle.onclick = toggleLayer(geojson, geojsonElements.toggle);
