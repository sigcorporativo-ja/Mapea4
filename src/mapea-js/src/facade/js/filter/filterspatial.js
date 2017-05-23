goog.provide('M.filter.Spatial');
goog.require('M.filter.Function');

/**
 * @namespace M.filter
 */
(function () {

  /**
   * Creates a Filter Spatial to filter features
   *
   * @param {M.layer.Vector|object} param - Layer or geometry
   * @param {function} filterFunction - filter function
   * @api stable
   */
  M.filter.Spatial = (function (param, filterFunction) {
    this.geometries_ = [];
    if (param instanceof M.layer.Vector) {
      this.geometries_ = [...param.getFeatures().map(feature => feature.getGeometry())];
    }
    else if (M.utils.isObject(param)) {
      this.geometries_ = [param];
    }
    goog.base(this, function (feature, index) {
      return filterFunction.bind(this)(feature.getGeometry(), index);
    }.bind(this));
  });
  goog.inherits(M.filter.Spatial, M.filter.Function);
})();
