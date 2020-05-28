/**
 * @module M/filter/Function
 */
import BaseFilter from './Base';
import { isNullOrEmpty } from '../util/Utils';

/**
 * @classdesc
 * A Filter represented by a function, which determines whether a feature complies
 * with the filter or not
 * @api
 */
class Function extends BaseFilter {
  /**
   * Creates a Filter Function to filter features
   *
   * @param {function} filterFunction function to execute
   * @param {Object} [options={}] declare 'cqlFilter' string equivalent inside, if any
   * @api
   */
  constructor(filterFunction, options = {}) {
    super();
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
    if (!isNullOrEmpty(options.cqlFilter)) {
      this.cqlFilter_ = options.cqlFilter;
    }
  }

  /**
   * Sets the function representing this filter
   *
   * @public
   * @function
   * @param {function} function
   * @api
   */
  setFunction(filterFunction) {
    this.filterFunction_ = filterFunction;
  }

  /**
   * Gets the function representing this filter
   *
   * @public
   * @function
   * @return {function} function
   * @api
   */
  getFunctionFilter() {
    return this.filterFunction_;
  }

  /**
   * Executes the filter
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features on which the filter runs
   * @return {Array<M.Feature>} features that comply with the filter
   * @api
   */
  execute(features) {
    return features.filter(this.filterFunction_);
  }

  /**
   * Returns the CQL equivalent to the filter, if defined
   *
   * @public
   * @function
   * @api
   * @return {string} CQL query
   */
  toCQL() {
    return this.cqlFilter_;
  }
}

export default Function;
