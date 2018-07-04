import Base from '../facade';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import WKTImpl from '../../../impl/js/format/wkt';

export default class WKT extends Base {

  constructor(options = {}) {
    var impl = new WKTImpl(options);
    // calls the super constructor
    super(this, impl);
    // checks if the implementation can create format GeoJSON
    if (Utils.isUndefined(WKTImpl)) {
      Exception('La implementación usada no puede M.impl.format.WKT');
    }

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
    return this.getImpl().write(geomtry);
  }
}
