goog.provide('M.filter');

/**
 * @namespace M.filter
 */
(function () {
  /**
   * This function joins the filters so that all the filters are fulfilled
   *
   * @function
   * @param {Array<M.Fiter>} filters - Filters to joins
   * @return {M.Filter} Filters joins
   * @api stable
   */
  M.filter.AND = function (filters) {
    return new M.filter.Function(function (feature) {
      return filters.every(function (filter) {
        return filter.getFunctionFilter()(feature);
      });
    });
  };

  /**
   * This function joins the filters so that at least one of the filters
   *
   * @function
   * @param {Array<M.Fiter>} filters - Filters to joins
   * @return {M.Filter} Filters joins
   * @api stable
   */
  M.filter.OR = function (filters) {
    return new M.filter.Function(function (feature) {
      return filters.some(function (filter) {
        return filter.getFunctionFilter()(feature);
      });
    });
  };

  /**
   * This function run the opposite of the filter
   *
   * @function
   * @param {M.Fiter} filters - Filters to joins
   * @return {M.Filter} opposite filter
   * @api stable
   */
  M.filter.NOT = function (filter) {
    return new M.filter.Function(function (feature) {
      return !filter.getFunctionFilter()(feature);
    });
  };


})();
