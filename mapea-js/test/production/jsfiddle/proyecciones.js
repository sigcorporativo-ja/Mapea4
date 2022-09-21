  // Definimos proyeccion 32630
  const proj32630 = {
    def: '+proj=utm +zone=30 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"',
    extent: [166021.4431, 0.0000, 833978.5569, 9329005.1825],
    codes: ['EPSG:32630', 'urn:ogc:def:crs:EPSG::32630', 'http://www.opengis.net/gml/srs/epsg.xml#32630'],
    units: 'm',
  };

  M.projection.addProjections(proj32630);


  // Reproyeccion vector con coordenadas en 32630
  var mapajs = M.map({
    container: 'map',
    wmcfiles: ['mapa'],
    controls: ['mouse']
  });

  mapajs.addLayers(new M.layer.GeoJSON({
    source: {
      "crs": {
        "properties": {
          "name": "EPSG:32630"
        },
        "type": "name"
      },
      "features": [{
        "properties": {
          "estado": 1,
          "name": "Punto 1"
        },
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [223659, 4149922]
        }
      }, {
        "properties": {
          "estado": 0,
          "name": "Punto 2"
        },
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [270705, 4136592]
        }
      }],
      "type": "FeatureCollection"
    },
    name: 'prueba'
  }));
