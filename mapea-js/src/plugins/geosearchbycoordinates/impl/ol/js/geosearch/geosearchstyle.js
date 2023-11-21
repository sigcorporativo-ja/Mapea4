export default class GeoSearchStyle {
  static init() {
    if (GeoSearchStyle.initialized === false) {
      GeoSearchStyle.initialized = true;

      // create default image
      const imgIconDefault = document.createElement('img');
      imgIconDefault.src = M.utils.concatUrlPaths([M.config.THEME_URL, '/img/m-pin-24.svg']);
      imgIconDefault.width = '24';
      imgIconDefault.height = '24';
      imgIconDefault.crossOrigin = 'anonymous';

      // create new image
      const imgIconNew = document.createElement('IMG');
      imgIconNew.src = M.utils.concatUrlPaths([M.config.THEME_URL, '/img/m-pin-24-new.svg']);
      imgIconNew.width = '24';
      imgIconNew.height = '24';
      imgIconNew.crossOrigin = 'anonymous';

      // create selected image
      const imgIconSelected = document.createElement('IMG');
      imgIconSelected.src = M.utils.concatUrlPaths([M.config.THEME_URL, '/img/m-pin-24-sel.svg']);
      imgIconSelected.width = '24';
      imgIconSelected.height = '24';
      imgIconSelected.crossOrigin = 'anonymous';

      // Create Default Style Point
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.POINT] = new ol.style.Style({
        image: new ol.style.Icon({
          img: imgIconDefault,
          // imgSize: [24, 24],
        }),
      });

      // Create Default Style Line
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.LINE_STRING] = new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#A15BD7',
        }),
        stroke: new ol.style.Stroke({
          color: '#A15BD7',
          width: 2,
        }),
      });

      // Create Default Style Polygon
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.POLYGON] = new ol.style.Style({
        image: new ol.style.Icon({
          img: imgIconDefault,
          // imgSize: [24, 24],
        }),
      });
      // Creates default geometries style
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.MULTI_POINT] =
        GeoSearchStyle.DEFAULT[M.geom.wkt.type.POINT];
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.LINEAR_RING] =
        GeoSearchStyle.DEFAULT[M.geom.wkt.type.LINE_STRING];
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.MULTI_LINE_STRING] =
        GeoSearchStyle.DEFAULT[M.geom.wkt.type.LINE_STRING];
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.MULTI_POLYGON] =
        GeoSearchStyle.DEFAULT[M.geom.wkt.type.POLYGON];
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.CIRCLE] =
        GeoSearchStyle.DEFAULT[M.geom.wkt.type.POLYGON];
      GeoSearchStyle.DEFAULT[M.geom.wkt.type.GEOMETRY_COLLECTION] =
        GeoSearchStyle.DEFAULT[M.geom.wkt.type.POLYGON];
      // ----

      // Create Default Style Point
      GeoSearchStyle.NEW[M.geom.wkt.type.POINT] = new ol.style.Style({
        image: new ol.style.Icon({
          img: imgIconNew,
          // imgSize: [24, 24],
        }),
      });

      // Create Default Style Line
      GeoSearchStyle.NEW[M.geom.wkt.type.LINE_STRING] = new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#e2951b',
        }),
        stroke: new ol.style.Stroke({
          color: '#e2951b',
          width: 2,
        }),
      });

      // Create Default Style Polygon
      GeoSearchStyle.NEW[M.geom.wkt.type.POLYGON] = new ol.style.Style({
        image: new ol.style.Icon({
          img: imgIconNew,
          // imgSize: [24, 24],
        }),
      });
      GeoSearchStyle.NEW[M.geom.wkt.type.MULTI_POINT] =
        GeoSearchStyle.NEW[M.geom.wkt.type.POINT];
      GeoSearchStyle.NEW[M.geom.wkt.type.LINEAR_RING] =
        GeoSearchStyle.NEW[M.geom.wkt.type.LINE_STRING];
      GeoSearchStyle.NEW[M.geom.wkt.type.MULTI_LINE_STRING] =
        GeoSearchStyle.NEW[M.geom.wkt.type.LINE_STRING];
      GeoSearchStyle.NEW[M.geom.wkt.type.MULTI_POLYGON] =
        GeoSearchStyle.NEW[M.geom.wkt.type.POLYGON];
      GeoSearchStyle.NEW[M.geom.wkt.type.CIRCLE] =
        GeoSearchStyle.NEW[M.geom.wkt.type.POLYGON];
      GeoSearchStyle.NEW[M.geom.wkt.type.GEOMETRY_COLLECTION] =
        GeoSearchStyle.NEW[M.geom.wkt.type.POLYGON];
      // ----

      // Create Default Style Point
      GeoSearchStyle.SELECTED[M.geom.wkt.type.POINT] = new ol.style.Style({
        image: new ol.style.Icon({
          img: imgIconSelected,
          // imgSize: [24, 24],
        }),
      });
      // Create Default Style Line
      GeoSearchStyle.SELECTED[M.geom.wkt.type.LINE_STRING] = new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#fcfcfc',
        }),
        stroke: new ol.style.Stroke({
          color: '#3589d1',
          width: 2,
        }),
      });
      // Create Default Style Polygon
      GeoSearchStyle.SELECTED[M.geom.wkt.type.POLYGON] = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(240, 220, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#a15bd7',
          width: 2,
        }),
      });
      GeoSearchStyle.SELECTED[M.geom.wkt.type.MULTI_POINT] =
        GeoSearchStyle.SELECTED[M.geom.wkt.type.POINT];
      GeoSearchStyle.SELECTED[M.geom.wkt.type.LINEAR_RING] =
        GeoSearchStyle.SELECTED[M.geom.wkt.type.LINE_STRING];
      GeoSearchStyle.SELECTED[M.geom.wkt.type.MULTI_LINE_STRING] =
        GeoSearchStyle.SELECTED[M.geom.wkt.type.LINE_STRING];
      GeoSearchStyle.SELECTED[M.geom.wkt.type.MULTI_POLYGON] =
        GeoSearchStyle.SELECTED[M.geom.wkt.type.POLYGON];
      GeoSearchStyle.SELECTED[M.geom.wkt.type.CIRCLE] =
        GeoSearchStyle.SELECTED[M.geom.wkt.type.POLYGON];
      GeoSearchStyle.SELECTED[M.geom.wkt.type.GEOMETRY_COLLECTION] =
        GeoSearchStyle.SELECTED[M.geom.wkt.type.POLYGON];
    }
  }
}

/**
 * TODO
 */
GeoSearchStyle.DEFAULT = {};
/**
 * TODO
 */
GeoSearchStyle.NEW = {};
/**
 * TODO
 */
GeoSearchStyle.SELECTED = {};

/**
 * TODO
 */
GeoSearchStyle.initialized = false;
