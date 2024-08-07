/**
 * @module M/impl/format/GML
 */
import OLFormatGML from 'ol/format/GML';
/**
 * @classdesc
 * @api
 */
class GML extends OLFormatGML {
  /**
   * @classdesc
   * Feature format for reading and writing data in the GeoJSON format.
   *
   * @constructor
   * @extends {ol.format.JSONFeature}
   * @param {olx.format.GeoJSONOptions=} optOptions Options.
   * @api stable
   */
  constructor(optOptions = {}) {
    super(optOptions);
  }
}

export default GML;
