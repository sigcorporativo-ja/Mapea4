goog.provide('M.filter.Function');
goog.require('M.Filter');

(function () {
  /**
   * Creates a Filter Function to filter features
   *
   * @param {function} filterFunction - Function to execute
   * @api stable
   */
  M.filter.Function = (function (filterFunction, options) {
    options = (options || {});

    /**
     * Function to execute
     * @private
     * @type {function}
     */
    this.filterFunction_ = filterFunction;

    /**
     * Filter CQL
     * @private
     * @type {String}
     */
    this.cqlFilter_ = '';
    if (!M.utils.isNullOrEmpty(options.cqlFilter)) {
      this.cqlFilter_ = options.cqlFilter;
    }
  });
  goog.inherits(M.filter.Function, M.Filter);

  /**
   * This function set a function filter
   *
   * @public
   * @function
   * @api stable
   */
  M.filter.Function.prototype.setFunction = function (filterFunction) {
    this.filterFunction_ = filterFunction;
  };

  /**
   * This function get a function filter
   *
   * @public
   * @function
   * @return {M.filter.Function} filter to execute
   * @api stable
   */
  M.filter.Function.prototype.getFunctionFilter = function () {
    return this.filterFunction_;
  };

  /**
   * This function execute a function filter
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @return {Array<M.Feature>} features to passed filter
   * @api stable
   */
  M.filter.Function.prototype.execute = function (features) {
    return features.filter(this.filterFunction_);
  };

  /**
   * This function return CQL
   *
   * @public
   * @function
   * @api stable
   * @return {string} CQL
   */
  M.filter.Function.prototype.toCQL = function () {
    return this.cqlFilter_;
  };
})();
