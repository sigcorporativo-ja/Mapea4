/**
 * @namespace M.filter
 */
export class FilterAbstract {

  /**
   * Abstract class
   *
   * @api stable
   */


  /**
   * This function get a function filter
   *
   * @public
   * @protected
   * @function
   */
  get FunctionFilter() {}

  /**
   * This function execute a function filter
   *
   * @protected
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @function
   */
  execute(features) {}

  /**
   * This function execute a function filter
   *
   * @protected
   * @param {Array<M.Feature>} features - Features on which the filter runs
   * @return {Array<M.Feature>} Result of execute
   * @function
   */
  toCQL() {}

}
