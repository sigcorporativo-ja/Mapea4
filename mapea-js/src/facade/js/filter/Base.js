/**
 * @module M/Filter
 */
/**
 * @classdesc
 * Abstract class
 * @api
 */
class Base {
  /**
   * Gets a function filter
   *
   * @public
   * @protected
   * @function
   */
  getFunctionFilter() {}

  /**
   * Executes a function filter
   *
   * @protected
   * @param {Array<M.Feature>} features features on which the filter runs
   * @returns {Array<M.Feature>} features that comply with the filter
   * @function
   */
  execute(features) {}

  /**
   * Returns the CQL equivalent of the filter
   *
   * @protected
   * @return {string} CQL query
   * @function
   */
  toCQL() {}
}

export default Base;
