// constructor del mapa
let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*d",
  layers: ["OSM"],
  center: {
    x: -5.9903369429549045,
    y: 37.387719139198396
  },
  zoom: 11,
  controls: ['layerswitcher', 'overviewmap'],
});

let lines = new M.layer.GeoJSON({
  name: 'lines',
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.992612838745117,
            37.37309025551174
          ],
          [
            -5.995101928710937,
            37.37922887106199
          ],
          [
            -6.000251770019531,
            37.38475319548924
          ],
          [
            -6.006259918212891,
            37.389526975189185
          ],
          [
            -6.006431579589844,
            37.39436864123474
          ],
          [
            -6.002826690673828,
            37.399141808653
          ],
          [
            -5.998878479003906,
            37.40275557605478
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.996518135070801,
            37.39208423213651
          ],
          [
            -5.995702743530273,
            37.39244224114773
          ],
          [
            -5.994973182678223,
            37.3927491046536
          ],
          [
            -5.993857383728027,
            37.39276615258931
          ],
          [
            -5.993063449859619,
            37.39281729637318
          ],
          [
            -5.992527008056641,
            37.393260541038465
          ],
          [
            -5.9920334815979,
            37.39387426009415
          ],
          [
            -5.99076747894287,
            37.39414702250599
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.990896224975586,
            37.39893725056989
          ],
          [
            -5.993127822875977,
            37.39675526294183
          ],
          [
            -5.995874404907227,
            37.397709890345894
          ],
          [
            -5.998620986938477,
            37.39702801486944
          ],
          [
            -5.998449325561523,
            37.39566424530531
          ],
          [
            -5.99802017211914,
            37.39436864123474
          ],
          [
            -5.996732711791992,
            37.39423226055614
          ],
          [
            -5.996131896972655,
            37.39436864123474
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.009778976440429,
            37.39327758885786
          ],
          [
            -6.012439727783203,
            37.39450502166522
          ],
          [
            -6.0121822357177725,
            37.39641432163643
          ],
          [
            -6.010723114013671,
            37.39832357297043
          ],
          [
            -6.00874900817871,
            37.399141808653
          ],
          [
            -6.006860733032227,
            37.399550923144204
          ],
          [
            -6.005229949951172,
            37.40105099050378
          ],
          [
            -6.006174087524414,
            37.4029601237152
          ],
          [
            -6.008062362670898,
            37.404801027532145
          ],
          [
            -6.010293960571289,
            37.404937388978624
          ]
        ]
        }
    }
  ]
  }
});

mapajs.addLayers([lines]);

let line = lines.getFeatures()[0];

let styleLine = new M.style.Line({
  label: {
    text: 'FEATURE',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: '#FE9A2E',
      width: 10
    },
    rotate: false,
    rotation: 0.5,
    align: M.style.align.RIGHT,
    baseline: M.style.baseline.TOP
  }
});

// Setea estilo a nivel de capa
function setStyleLayer() {
  // lines.setStyle(styleLine);
  // lines.getImpl().getOL3Layer().setTextPathStyle(function(f) {
  //   return [new ol.style.Style({
  //     text: new ol.style.TextPath({
  //       text: "Feature",
  //       font: "15px Arial",
  //       fill: new ol.style.Fill({
  //         color: "#369"
  //       }),
  //       stroke: new ol.style.Stroke({
  //         color: "#fff",
  //         width: 3
  //       }),
  //       textBaseline: 'middle',
  //       textAlign: "center",
  //       rotateWithView: false,
  //       textOverflow: "custom",
  //       minWidth: 0
  //     }),
  //     geometry: null
  //   })]
  // }, 0);


  let textStyle = new ol.style.Style({
    text: new M.impl.style.TextPath({
      text: "Feature",
      font: "24px Arial",
      fill: new ol.style.Fill({
        color: "red"
      }),
      stroke: new ol.style.Stroke({
        color: "#fff",
        width: 3
      }),
      textBaseline: 'middle',
      textAlign: "center",
      rotateWithView: false,
      textOverflow: "custom",
      minWidth: 0
    }),
    geometry: null
  });
  // lines.getImpl().getOL3Layer().setTextPathStyle(textStyle);
  lines.getImpl().getOL3Layer().setStyle(textStyle);
}

//Setea estilo a nivel de feature
function setStyleFeature(feature, style) {
  line.setStyle(styleLine);
}
geojson_test();
//kml_test();
//wfs_test();
location_test();
//geosearch_test();
geosearchbylocation_test();
//earchstreet_test();
center_test();
searchstreetgeosearch_test();
