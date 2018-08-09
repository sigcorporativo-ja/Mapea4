import OLFormatGML from 'ol/format/GML';

export default class GML extends OLFormatGML {
  /**
   * @classdesc
   * Feature format for reading and writing data in the GeoJSON format.
   *
   * @constructor
   * @extends {ol.format.JSONFeature}
   * @param {olx.format.GeoJSONOptions=} opt_options Options.
   * @api stable
   */
  constructor(opt_options = {}) {
    super(opt_options);
  }
}
