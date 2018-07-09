import FilterFunction from "./Function";

export default class Filter {
  /**
   * This function joins the filters so that all the filters are fulfilled
   *
   * @function
   * @param {Array<M.Fiter>} filters - Filters to joins
   * @return {M.Filter} Filters joins
   * @api stable
   */
  static AND(filters) {
    let cqlFilter = '';
    let numFilters = filters.length;
    filters.forEach((filter, index) => {
      cqlFilter += `(${filter.toCQL()})`;
      if (index < (numFilters - 1)) {
        cqlFilter += ' AND ';
      }
    });
    return new FilterFunction(feature => {
      return filters.every(filter => {
        return filter.functionFilter()(feature);
      });
    }, {
      cqlFilter: cqlFilter
    });
  }

  /**
   * This function joins the filters so that at least one of the filters
   *
   * @function
   * @param {Array<M.Fiter>} filters - Filters to joins
   * @return {M.Filter} Filters joins
   * @api stable
   */
  static OR(filters) {
    let numFilters = filters.length;
    let cqlFilter = '';
    filters.forEach((filter, index) => {
      cqlFilter += `(${filter.toCQL()})`;
      if (index < (numFilters - 1)) {
        cqlFilter += ' OR ';
      }
    });
    return new FilterFunction(feature => {
      return filters.some(filter => {
        return filter.functionFilter()(feature);
      });
    }, {
      cqlFilter: cqlFilter
    });
  }

  /**
   * This function run the opposite of the filter
   *
   * @function
   * @param {M.Fiter} filters - Filters to joins
   * @return {M.Filter} opposite filter
   * @api stable
   */
  static NOT(filter) {
    return new FilterFunction(feature => {
      return !filter.functionFilter()(feature);
    }, {
      cqlFilter: `NOT ${filter.toCQL()}`
    });
  }

  /**
   * This function compares the value of the indicated attribute with the indicated value.
   *
   * @function
   * @param {string} nameAtt - Name Attribute
   * @param {string|number} value - Value to compare
   * @return {M.Filter} Filter - Filter to compare the value of an attribute
   * @api stable
   */
  static EQUAL(nameAtt, value) {
    return new FilterFunction(feature => {
      return Object.is(feature.getAttribute(nameAtt), value);
    }, {
      cqlFilter: `${nameAtt}='${value}'`
    });
  }

  /**
   * This function return the value of the indicated attribute of the feature if it satisfies the condition of the regular expression
   *
   * @function
   * @param {string} nameAtt - Name Attribute
   * @param {string|number} value - Regular expression
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  static LIKE(nameAtt, value) {
    return new FilterFunction(feature => {
      return (feature.getAttribute(nameAtt)).toString().match(new RegExp(value));
    }, {
      cqlFilter: `${nameAtt} LIKE '%${value}%'`
    });
  }

  /**
   * This function returns if the value of the indicated attribute of the feature is less than the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  static LT(nameAtt, value) {
    return new FilterFunction(feature => {
      return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) < value;
    }, {
      cqlFilter: `${nameAtt} < '${value}'`
    });
  }

  /**
   * This function returns if the value of the indicated attribute of the feature is greater than the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  static GT(nameAtt, value) {
    return new FilterFunction(feature => {
      return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) > value;
    }, {
      cqlFilter: `${nameAtt} > '${value}'`
    });
  }

  /**
   * This function returns if the value of the indicated attribute of the feature is less than or equal to the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  static LTE(nameAtt, value) {
    return new FilterFunction(feature => {
      return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) <= value;
    }, {
      cqlFilter: `${nameAtt} <= '${value}'`
    });
  }

  /**
   * This function returns if the value of the indicated attribute of the feature is greater than or equal to the indicated value.
   * @function
   * @param {string} nameAtt - name Attribute
   * @param {string|number} value - value to compare
   * @return {M.Filter} Filter - Filter
   * @api stable
   */
  static GTE(nameAtt, value) {
    return new FilterFunction(feature => {
      return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) >= value;
    }, {
      cqlFilter: `${nameAtt} >= '${value}'`
    });
  }
}