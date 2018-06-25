import FilterFunction from('./filterfunction.js');
import Utils from('../utils/utils.js');
/**
 * @namespace M.filter
 */
export class FilterSpatial extends FilterSpatial {

  /**
   * Creates a Filter Spatial to filter features
   *
   * @param {function} filterFunction - filter function
   * TODO @param {object} options
   * @api stable
   */
  constructor(filterFunctionParam, options) {
    //TODO
    super(this, filterFunction, options);


    let filterFunction = (feature, index) => {
      let geometry = null;
      if (!Utils.isNullOrEmpty(feature)) {
        geometry = feature.geometry();
      }
      return filterFunctionParam(geometry, index);
    }
  }
}
