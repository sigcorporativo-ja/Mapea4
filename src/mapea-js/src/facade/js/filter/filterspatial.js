goog.provide('M.filter.Spatial');
goog.require('M.filter.Function');

/**
 * @namespace M.filter
 */
(function () {

  /**
   * Creates a Filter Spatial to filter features
   *
   * @param {function} filterFunction - filter function
   * TODO @param {object} options
   * @api stable
   */
  M.filter.Spatial = (function (filterFunctionParam, options) {

    let filterFunction = function (feature, index) {
      let geometry = null;
      if (!M.utils.isNullOrEmpty(feature)) {
        geometry = feature.getGeometry();
      }
      return filterFunctionParam(geometry, index);
    };

    goog.base(this, filterFunction, options);
  });
  goog.inherits(M.filter.Spatial, M.filter.Function);
})();
