/**
 * @module M/layer/type
 */
import { normalize, isString } from '../util/Utils';

/**
 * WMC type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WMC = 'WMC';

/**
 * KML type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const KML = 'KML';

/**
 * WMS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WMS = 'WMS';

/**
 * WFS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WFS = 'WFS';

/**
 * WMTS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WMTS = 'WMTS';

/**
 * MBtiles type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const MBtiles = 'MBtiles';

/**
 * OSM type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const OSM = 'OSM';

/**
 * Mapbox type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const Mapbox = 'Mapbox';

/**
 * GeoJSON type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const GeoJSON = 'GeoJSON';

/**
 * Vector type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const Vector = 'Vector';

/**
 * All layer types
 * @const
 * @type {object}
 *
 */
const layertypes = {
  WMC,
  KML,
  WMS,
  WFS,
  WMTS,
  MBtiles,
  OSM,
  Mapbox,
  GeoJSON,
  Vector,
};

/**
 * Parses the type
 * @private
 * @function
 * @param {string} rawType the type to be parsed
 */
export const parse = (rawType) => {
  let type = normalize(rawType, true);
  if (type === 'WMS_FULL') {
    type = WMS;
  } else if (type === 'WFST') {
    type = WFS;
  } else {
    type = Object.keys(layertypes).find((knowType) => {
      const knowTypeVal = layertypes[knowType];
      return (isString(knowTypeVal) && (normalize(knowTypeVal, true) === type));
    });
  }
  return layertypes[type];
};

/**
 * Parses the type
 * @private
 * @function
 * @param {string} rawType the type to be parsed
 */
export const know = (type) => {
  const knowTypes = [
    WMC,
    KML,
    WMS,
    WFS,
    WMTS,
    MBtiles,
  ];
  return (knowTypes.indexOf(parse(type)) !== -1);
};
