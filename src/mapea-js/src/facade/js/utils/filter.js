goog.provide('M.filter');

/**
 * @namespace M.filter
 */
(function () {
  /**
   * TODO
   *
   * @function
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
   * TODO
   *
   * @function
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
   * TODO
   *
   * @function
   * @api stable
   */
  M.filter.NOT = function (filter) {
    return new M.filter.Function(function (feature) {
      return !filter.getFunctionFilter()(feature);
    });
  };

})();
