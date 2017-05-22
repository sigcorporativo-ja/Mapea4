goog.provide('M.filter.Spatial');

/**
 * @namespace M.filter
 */
(function () {

  /**
   * Abstract class
   *
   * @api stable
   */
  M.filter.Spatial = (function () {
    [this.layer_, this.geometry_, this.cql_] = [null, null, null];
  });

  /**
   * This function get a function filter
   *
   * @public
   * @protected
   * @function
   */
  M.filter.Spatial.prototype.getFunctionFilter = function () {};

  /**
   * This function return CQL
   *
   * @public
   * @function
   * @return {string} CQL
   */
  M.filter.Spatial.prototype.toCQL = function () {};

  /**
   * This function execute a function filter
   *
   * @protected
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @return {Array<M.Feature>} Result of execute
   * @function
   */
  M.filter.Spatial.prototype.execute = function (features) {};

})();
