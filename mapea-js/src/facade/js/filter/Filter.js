/**
 * @module M/filter
 */
import FilterFunction from './Function';
/**
 * This function joins the filters so that all the filters are fulfilled
 *
 * @function
 * @param {Array<M.Fiter>} filters - Filters to joins
 * @return {M.Filter} Filters joins
 * @api
 */
export const AND = (filters) => {
  let cqlFilter = '';
  const numFilters = filters.length;
  filters.forEach((filter, index) => {
    cqlFilter += `(${filter.toCQL()})`;
    if (index < (numFilters - 1)) {
      cqlFilter += ' AND ';
    }
  });
  return new FilterFunction((feature) => {
    return filters.every((filter) => {
      return filter.getFunctionFilter()(feature);
    });
  }, {
    cqlFilter,
  });
};

/**
 * This function joins the filters so that at least one of the filters
 *
 * @function
 * @param {Array<M.Fiter>} filters - Filters to joins
 * @return {M.Filter} Filters joins
 * @api
 */
export const OR = (filters) => {
  const numFilters = filters.length;
  let cqlFilter = '';
  filters.forEach((filter, index) => {
    cqlFilter += `(${filter.toCQL()})`;
    if (index < (numFilters - 1)) {
      cqlFilter += ' OR ';
    }
  });
  return new FilterFunction((feature) => {
    return filters.some((filter) => {
      return filter.getFunctionFilter()(feature);
    });
  }, {
    cqlFilter,
  });
};

/**
 * This function run the opposite of the filter
 *
 * @function
 * @param {M.Fiter} filters - Filters to joins
 * @return {M.Filter} opposite filter
 * @api
 */
export const NOT = (filter) => {
  return new FilterFunction((feature) => {
    return !filter.getFunctionFilter()(feature);
  }, {
    cqlFilter: `NOT ${filter.toCQL()}`,
  });
};

/**
 * This function compares the value of the indicated attribute with the indicated value.
 *
 * @function
 * @param {string} nameAtt - Name Attribute
 * @param {string|number} value - Value to compare
 * @return {M.Filter} Filter - Filter to compare the value of an attribute
 * @api
 */
export const EQUAL = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return Object.is(feature.getAttribute(nameAtt), value);
  }, {
    cqlFilter: `${nameAtt}='${value}'`,
  });
};

/**
 * This function return the value of the indicated attribute of the feature
 * if it satisfies the condition of the regular expression
 *
 * @function
 * @param {string} nameAtt - Name Attribute
 * @param {string|number} value - Regular expression
 * @return {M.Filter} Filter - Filter
 * @api
 */
export const LIKE = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return (feature.getAttribute(nameAtt)).toString().match(new RegExp(value));
  }, {
    cqlFilter: `${nameAtt} LIKE '%${value}%'`,
  });
};

/**
 * This function returns if the value of the indicated attribute of
 * the feature is less than the indicated value.
 * @function
 * @param {string} nameAtt - name Attribute
 * @param {string|number} value - value to compare
 * @return {M.Filter} Filter - Filter
 * @api
 */
export const LT = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) < value;
  }, {
    cqlFilter: `${nameAtt} < '${value}'`,
  });
};

/**
 * This function returns if the value of the indicated attribute of the feature
 * is greater than the indicated value.
 * @function
 * @param {string} nameAtt - name Attribute
 * @param {string|number} value - value to compare
 * @return {M.Filter} Filter - Filter
 * @api
 */
export const GT = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) > value;
  }, {
    cqlFilter: `${nameAtt} > '${value}'`,
  });
};

/**
 * This function returns if the value of the indicated attribute of
 * the feature is less than or equal to the indicated value.
 * @function
 * @param {string} nameAtt - name Attribute
 * @param {string|number} value - value to compare
 * @return {M.Filter} Filter - Filter
 * @api
 */
export const LTE = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) <= value;
  }, {
    cqlFilter: `${nameAtt} <= '${value}'`,
  });
};

/**
 * This function returns if the value of the indicated attribute of
 * the feature is greater than or equal to the indicated value.
 * @function
 * @param {string} nameAtt - name Attribute
 * @param {string|number} value - value to compare
 * @return {M.Filter} Filter - Filter
 * @api
 */
export const GTE = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) >= value;
  }, {
    cqlFilter: `${nameAtt} >= '${value}'`,
  });
};
