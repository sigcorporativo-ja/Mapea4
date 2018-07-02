import Base from('../facade.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import WKTImpl from('../../../impl/js/format/wkt.js');

export class WKT extends Base {

  constructor(options = {}) {
    // checks if the implementation can create format GeoJSON
    if (Utils.isUndefined(WKTImpl)) {
      Exception('La implementación usada no puede M.impl.format.WKT');
    }

    /**
     * Implementation of this formatter
     * @public
     * @type {M.impl.format.WKT}
     */
    var impl = new WKTImpl(options);

    // calls the super constructor
    super(this, impl);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Array<Object>}
   * @api stable
   */
  write(geomtry) {
    return this.impl().write(geomtry);
  }
}
