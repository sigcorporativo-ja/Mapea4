import BaseFilter from './Base':
import Utils from '../util/Utils';

export default class Function extends BaseFilter {
  /**
   * Creates a Filter Function to filter features
   *
   * @param {function} filterFunction - Function to execute
   * @api stable
   */
  constructor(filterFunction, options = {}) {

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
    if (Utils.isNullOrEmpty(options.cqlFilter)) {
      this.cqlFilter_ = options.cqlFilter;
    }
  }

  /**
   * This function set a function filter
   *
   * @public
   * @function
   * @api stable
   */
  setFunction(filterFunction) {
    this.filterFunction_ = filterFunction;
  }

  /**
   * This function get a function filter
   *
   * @public
   * @function
   * @return {M.filter.Function} filter to execute
   * @api stable
   */
  getFunctionFilter() {
    return this.filterFunction_;
  }

  /**
   * This function execute a function filter
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @return {Array<M.Feature>} features to passed filter
   * @api stable
   */
  execute(features) {
    return features.filter(this.filterFunction_);
  }

  /**
   * This function return CQL
   *
   * @public
   * @function
   * @api stable
   * @return {string} CQL
   */
  toCQL() {
    return this.cqlFilter_;
  }
}