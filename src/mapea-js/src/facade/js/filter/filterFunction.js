goog.provide('M.filter.Function');
goog.require('M.Filter');

(function () {
  /**
   * @classdesc
   * TODO
   *
   * @constructor
   * @param {function} funtion - funtion to filter
   * @api stable
   */
  M.filter.Function = (function (filterFunction) {
    this.filterFunction_ = filterFunction;
  });
  goog.inherits(M.filter.Function, M.Filter);

  /**
   * TODO
   *
   * @public
   * @function
   */
  M.filter.Function.prototype.setFunction = function (filterFunction) {
    this.filterFunction_ = filterFunction;
  };

  /**
   * TODO
   *
   * @public
   * @function
   */
  M.filter.Function.prototype.getFunctionFilter = function () {
    return this.filterFunction_;
  };


  /**
   * TODO
   *
   * @protected
   * @function
   */
  M.filter.Function.prototype.execute = function (features) {
    return features.filter(this.filterFunction_);
  };

})();
