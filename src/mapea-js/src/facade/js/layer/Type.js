import { normalize, isString } from '../util/Utils';

export default class LayerType {
  /**
   * Parses the type
   * @private
   * @function
   * @param {string} rawType the type to be parsed
   */
  static parse(rawType) {
    let type = normalize(rawType, true);
    if (type === 'WMS_FULL') {
      type = LayerType.WMS;
    } else if (type === 'WFST') {
      type = LayerType.WFS;
    } else {
      type = Object.keys(LayerType).find((knowType) => {
        const knowTypeVal = LayerType[knowType];
        return (isString(knowTypeVal) && (normalize(knowTypeVal, true) === type));
      });
    }
    return LayerType[type];
  }

  /**
   * Parses the type
   * @private
   * @function
   * @param {string} rawType the type to be parsed
   */
  static know(type) {
    const knowTypes = [
      LayerType.WMC,
      LayerType.KML,
      LayerType.WMS,
      LayerType.WFS,
      LayerType.WMTS,
      LayerType.MBtiles,
    ];
    return (knowTypes.indexOf(LayerType.parse(type)) !== -1);
  }
}

/**
 * WMC type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.WMC = 'WMC';

/**
 * KML type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.KML = 'KML';

/**
 * WMS type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.WMS = 'WMS';

/**
 * WFS type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.WFS = 'WFS';

/**
 * WMTS type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.WMTS = 'WMTS';

/**
 * MBtiles type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.MBtiles = 'MBtiles';

/**
 * OSM type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.OSM = 'OSM';

/**
 * Mapbox type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.Mapbox = 'Mapbox';

/**
 * GeoJSON type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.GeoJSON = 'GeoJSON';

/**
 * Vector type
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerType.Vector = 'Vector';
