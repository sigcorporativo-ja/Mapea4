/**
 * @module M/format/WKT
 */
import WKTImpl from 'impl/format/WKT';
import Base from '../Base';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class WKT extends Base {
  /**
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Object} userParameters parameters
   * provided by the user
   * @api
   */
  constructor(options = {}) {
    const impl = new WKTImpl(options);
    // calls the super constructor
    super(impl);
    // checks if the implementation can create format GeoJSON
    if (isUndefined(WKTImpl)) {
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
   * @api
   */
  write(geomtry) {
    return this.getImpl().write(geomtry);
  }
}

export default WKT;
