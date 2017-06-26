goog.provide('M.Filter');

/**
 * @namespace M.filter
 */
(function () {

  /**
   * Abstract class
   *
   * @api stable
   */
  M.Filter = (function () {});

  /**
   * This function get a function filter
   *
   * @public
   * @protected
   * @function
   */
  M.Filter.prototype.getFunctionFilter = function () {};

  /**
   * This function execute a function filter
   *
   * @protected
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @function
   */
  M.Filter.prototype.execute = function (features) {};

  /**
   * This function execute a function filter
   *
   * @protected
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @return {Array<M.Feature>} Result of execute
   * @function
   */
  M.Filter.prototype.toCQL = function () {};

})();
