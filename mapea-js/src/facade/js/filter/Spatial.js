/**
 * @module M/filter
 */
import FilterFunction from './Function';
import { isNullOrEmpty } from '../util/Utils';

/**
 * @classdesc
 * A filter whith a spatial function associated
 * @api
 */
class Spatial extends FilterFunction {
  /**
   * Creates a spatial filter
   *
   * @param {function} function filter function
   * @param {object} [options={}] options
   * @api
   */
  constructor(FunctionParam, options) {
    const filterFunction = (feature, index) => {
      let geometry = null;
      if (!isNullOrEmpty(feature)) {
        geometry = feature.getGeometry();
      }
      return FunctionParam(geometry, index);
    };
    super(filterFunction, options);
  }
}

export default Spatial;
