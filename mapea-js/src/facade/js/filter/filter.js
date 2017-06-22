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
    let cqlFilter = '';
    let numFilters = filters.length;
    filters.forEach(function (filter, index) {
      cqlFilter += `(${filter.toCQL()})`;
      if (index < (numFilters - 1)) {
        cqlFilter += ' AND ';
      }
    });
    return new M.filter.Function(function (feature) {
      return filters.every(function (filter) {
        return filter.getFunctionFilter()(feature);
      });
    }, {
      cqlFilter: cqlFilter
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
    let cqlFilter = '';
    let numFilters = filters.length;
    filters.forEach(function (filter, index) {
      cqlFilter += `(${filter.toCQL()})`;
      if (index < (numFilters - 1)) {
        cqlFilter += ' OR ';
      }
    });
    return new M.filter.Function(function (feature) {
      return filters.some(function (filter) {
        return filter.getFunctionFilter()(feature);
      });
    }, {
      cqlFilter: cqlFilter
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
    }, {
      cqlFilter: `NOT ${filter.toCQL()}`
    });
  };

  /**
   * This function compares the value of the indicated attribute with the indicated value.
   *
   * @function
   * @param {string} nameAtt - Name Attribute
   * @param {string|number} value - Value to compare
   * @return {M.Filter} Filter - Filter to compare the value of an attribute
   * @api stable
   */
  M.filter.EQUAL = function (nameAtt, value) {
    return new M.filter.Function(function (feature) {
      return Object.is(feature.getAttribute(nameAtt), value);
    }, {
      cqlFilter: `${nameAtt}='${value}'`
    });
  };

  /**
   * This function return the value of the indicated attribute of the feature if it satisfies the condition of the regular expression
   *
   * @function
   * @param {string} nameAtt - Name Attribute
   * @param {string|number} value - Regular expression
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  M.filter.LIKE = function (nameAtt, value) {
    return new M.filter.Function(function (feature) {
      return (feature.getAttribute(nameAtt)).toString().match(new RegExp(value));
    }, {
      cqlFilter: `${nameAtt} LIKE '%${value}%'`
    });
  };

  /**
   * This function returns if the value of the indicated attribute of the feature is less than the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  M.filter.LT = function (nameAtt, value) {
    return new M.filter.Function(function (feature) {
      return feature.getAttribute(nameAtt) < value;
    }, {
      cqlFilter: `${nameAtt} < '${value}'`
    });
  };

  /**
   * This function returns if the value of the indicated attribute of the feature is greater than the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  M.filter.GT = function (nameAtt, value) {
    return new M.filter.Function(function (feature) {
      return feature.getAttribute(nameAtt) > value;
    }, {
      cqlFilter: `${nameAtt} > '${value}'`
    });
  };

  /**
   * This function returns if the value of the indicated attribute of the feature is less than or equal to the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  M.filter.LTE = function (nameAtt, value) {
    return new M.filter.Function(function (feature) {
      return feature.getAttribute(nameAtt) <= value;
    }, {
      cqlFilter: `${nameAtt} <= '${value}'`
    });
  };

  /**
   * This function returns if the value of the indicated attribute of the feature is greater than or equal to the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  M.filter.GTE = function (nameAtt, value) {
    return new M.filter.Function(function (feature) {
      return feature.getAttribute(nameAtt) >= value;
    }, {
      cqlFilter: `${nameAtt} >= '${value}'`
    });
  };

})();
