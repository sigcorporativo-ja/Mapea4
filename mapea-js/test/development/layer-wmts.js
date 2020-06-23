import { map } from 'M/mapea';
import { getWMTSCapabilities } from 'M/util/Utils'
import WMTS from 'M/layer/WMTS';
import { createFromCapabilitiesMatrixSet } from 'ol/tilegrid/WMTS';
import { get as getProj } from 'ol/proj';

const mapajs = map({
  container: 'map',
});

// const cap = getWMTSCapabilities('http://www.ideandalucia.es/geowebcache/service/wmts?request=GetCapabilities&service=WMTS');

// OPCION 2: Con el metodo addLayers
// const layer = new WMTS({
//   url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
//   name: 'toporaster',
//   matrixSet: 'EPSG:25830',
//   legend: 'Toporaster',
// });
// let capabilitiesGeneral = layer.getCapabilities();

const projection = getProj('EPSG:25830');

const matrixSetObj = {
  "Identifier": "SIG-C:23030",
  "SupportedCRS": "urn:ogc:def:crs:EPSG::23030",
  "TileMatrix": [{
    "Identifier": "SIG-C:23030:0",
    "ScaleDenominator": 4793932.853568918,
    "TopLeftCorner": [96500, 4303629],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 2,
    "MatrixHeight": 1
  }, {
    "Identifier": "SIG-C:23030:1",
    "ScaleDenominator": 2897815.161379691,
    "TopLeftCorner": [96500, 4375431],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 3,
    "MatrixHeight": 2
  }, {
    "Identifier": "SIG-C:23030:2",
    "ScaleDenominator": 1751658.3911413108,
    "TopLeftCorner": [96500, 4336677],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 5,
    "MatrixHeight": 3
  }, {
    "Identifier": "SIG-C:23030:3",
    "ScaleDenominator": 1058834.6558981012,
    "TopLeftCorner": [96500, 4339486],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 7,
    "MatrixHeight": 5
  }, {
    "Identifier": "SIG-C:23030:4",
    "ScaleDenominator": 640039.6528231547,
    "TopLeftCorner": [96500, 4327024],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 12,
    "MatrixHeight": 8
  }, {
    "Identifier": "SIG-C:23030:5",
    "ScaleDenominator": 386888.3162296191,
    "TopLeftCorner": [96500, 4320518],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 19,
    "MatrixHeight": 13
  }, {
    "Identifier": "SIG-C:23030:6",
    "ScaleDenominator": 233864.52475991752,
    "TopLeftCorner": [96500, 4312032],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 32,
    "MatrixHeight": 21
  }, {
    "Identifier": "SIG-C:23030:7",
    "ScaleDenominator": 141365.3854274625,
    "TopLeftCorner": [96500, 4304524],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 52,
    "MatrixHeight": 34
  }, {
    "Identifier": "SIG-C:23030:8",
    "ScaleDenominator": 85451.91801779483,
    "TopLeftCorner": [96500, 4303011],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 86,
    "MatrixHeight": 56
  }, {
    "Identifier": "SIG-C:23030:9",
    "ScaleDenominator": 51653.59448382611,
    "TopLeftCorner": [96500, 4300633],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 142,
    "MatrixHeight": 92
  }, {
    "Identifier": "SIG-C:23030:10",
    "ScaleDenominator": 31223.33453701925,
    "TopLeftCorner": [96500, 4300189],
    "TileWidth": 256,
    "TileHeight": 256,
    "MatrixWidth": 235,
    "MatrixHeight": 152
  }, { "Identifier": "SIG-C:23030:11", "ScaleDenominator": 18873.74207647604, "TopLeftCorner": [96500, 4300923], "TileWidth": 256, "TileHeight": 256, "MatrixWidth": 389, "MatrixHeight": 252 }, { "Identifier": "SIG-C:23030:12", "ScaleDenominator": 11408.715476785477, "TopLeftCorner": [96500, 4300195], "TileWidth": 256, "TileHeight": 256, "MatrixWidth": 643, "MatrixHeight": 416 }, { "Identifier": "SIG-C:23030:13", "ScaleDenominator": 6896.289474702132, "TopLeftCorner": [96500, 4300096], "TileWidth": 256, "TileHeight": 256, "MatrixWidth": 1064, "MatrixHeight": 688 }, { "Identifier": "SIG-C:23030:14", "ScaleDenominator": 4168.638320033518, "TopLeftCorner": [96500, 4300043], "TileWidth": 256, "TileHeight": 256, "MatrixWidth": 1759, "MatrixHeight": 1138 }, { "Identifier": "SIG-C:23030:15", "ScaleDenominator": 2519.8399091277192, "TopLeftCorner": [96500, 4300111], "TileWidth": 256, "TileHeight": 256, "MatrixWidth": 2910, "MatrixHeight": 1883 }]
};

const extent = [-729785.83, 3715125.82, 940929.67, 9518470.69];


const layer2 = new WMTS({
  url: "http://www.ideandalucia.es/geowebcache/service/wmts",
  name: "orto_2010-11",
  matrixSet: "EPSG:25830",
  legend: "orto_2010-11"
}, {
  capabilities: {
    "urls": [
      "http://www.ideandalucia.es/geowebcache/service/wmts?"
    ],
    "layer": "orto_2010-11",
    "matrixSet": "SIG-C:23030",
    "format": "image/png",
    "projection": projection,
    "requestEncoding": "KVP",
    "tileGrid": createFromCapabilitiesMatrixSet(matrixSetObj, extent),
    "style": "",
    "dimensions": {}
  },
});

mapajs.addWMTS(layer2);
