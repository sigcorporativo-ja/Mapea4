goog.provide('Geobusquedas.feature.style');

(function () {

   /*******************
         DEFAULT
    *******************/
   var DEFAULT = {
      'POINT': {
         image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
               color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
               color: '#087021',
               width: 1
            })
         })
      },
      'LINE': {
         fill: new ol.style.Fill({
            color: '#087021'
         }),
         stroke: new ol.style.Stroke({
            color: '#087021',
            width: 2
         })
      },
      'POLYGON': {
         image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
               color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
               color: '#087021',
               width: 1
            })
         })
      }
   };
   Geobusquedas.feature.style.DEFAULT = {};
   // default point
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.POINT] = new ol.style.Style(DEFAULT.POINT);
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.MULTI_POINT] = Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.POINT];
   // default line
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.LINE_STRING] = new ol.style.Style(DEFAULT.LINE);
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.LINEAR_RING] = Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.LINE_STRING];
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.MULTI_LINE_STRING] = Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.LINE_STRING];
   // default polygon
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.POLYGON] = new ol.style.Style(DEFAULT.POLYGON);
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.MULTI_POLYGON] = Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.POLYGON];
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.CIRCLE] = Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.POLYGON];
   Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.GEOMETRY_COLLECTION] = Geobusquedas.feature.style.DEFAULT[M.geom.wkt.type.POLYGON];

   /*******************
         NEW
    *******************/
   var NEW = {
      'POINT': {
         image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
               color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
               color: '#e2951b',
               width: 1
            })
         })
      },
      'LINE': {
         fill: new ol.style.Fill({
            color: '#e2951b'
         }),
         stroke: new ol.style.Stroke({
            color: '#e2951b',
            width: 2
         })
      },
      'POLYGON': {
         fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0)'
         }),
         stroke: new ol.style.Stroke({
            color: '#e2951b',
            width: 1
         })
      }
   };
   Geobusquedas.feature.style.NEW = {};
   // NEW point
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.POINT] = new ol.style.Style(NEW.POINT);
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.MULTI_POINT] = Geobusquedas.feature.style.NEW[M.geom.wkt.type.POINT];
   // NEW line
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.LINE_STRING] = new ol.style.Style(NEW.LINE);
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.LINEAR_RING] = Geobusquedas.feature.style.NEW[M.geom.wkt.type.LINE_STRING];
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.MULTI_LINE_STRING] = Geobusquedas.feature.style.NEW[M.geom.wkt.type.LINE_STRING];
   // NEW polygon
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.POLYGON] = new ol.style.Style(NEW.POLYGON);
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.MULTI_POLYGON] = Geobusquedas.feature.style.NEW[M.geom.wkt.type.POLYGON];
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.CIRCLE] = Geobusquedas.feature.style.NEW[M.geom.wkt.type.POLYGON];
   Geobusquedas.feature.style.NEW[M.geom.wkt.type.GEOMETRY_COLLECTION] = Geobusquedas.feature.style.NEW[M.geom.wkt.type.POLYGON];

   /*******************
         SELECT
    *******************/
   var SELECTED = {
      'POINT': {
         image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
               color: '#fcfcfc'
            }),
            stroke: new ol.style.Stroke({
               color: '#3589d1',
               width: 2
            })
         })
      },
      'LINE': {
         fill: new ol.style.Fill({
            color: '#fcfcfc'
         }),
         stroke: new ol.style.Stroke({
            color: '#3589d1',
            width: 2
         })
      },
      'POLYGON': {
         fill: new ol.style.Fill({
            color: '#fcfcfc'
         }),
         stroke: new ol.style.Stroke({
            color: '#3589d1',
            width: 2
         })
      }
   };
   Geobusquedas.feature.style.SELECTED = {};
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.POINT] = new ol.style.Style(SELECTED.POINT);
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.MULTI_POINT] = Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.POINT];
   // SELECTED line
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.LINE_STRING] = new ol.style.Style(SELECTED.LINE);
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.LINEAR_RING] = Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.LINE_STRING];
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.MULTI_LINE_STRING] = Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.LINE_STRING];
   // SELECTED polygon
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.POLYGON] = new ol.style.Style(SELECTED.POLYGON);
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.MULTI_POLYGON] = Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.POLYGON];
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.CIRCLE] = Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.POLYGON];
   Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.GEOMETRY_COLLECTION] = Geobusquedas.feature.style.SELECTED[M.geom.wkt.type.POLYGON];
})();