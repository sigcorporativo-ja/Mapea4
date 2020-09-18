/**
 * @module M/filter
 */
import FilterFunction from './Function';
/**
 * Logical AND operator, all filters must be fulfilled
 *
 * @function
 * @param {Array<M.Filter>} filters filters to join
 * @return {M.Filter} filter
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
 * Logical OR operator, at least one filter must be fulfilled
 *
 * @function
 * @param {Array<M.Fiter>} filters filters to join
 * @return {M.Filter} filter
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
 * Logical NOT operator, returns the opposite of the filter
 *
 * @function
 * @param {M.Filter} filters filter to negate
 * @return {M.Filter} filter
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
 * Compares an attribute with a value.
 *
 * @function
 * @param {string} nameAtt attribute to compare
 * @param {string|number} value value to compare
 * @return {M.Filter} filter
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
 * Compares an attribute with a regular expression
 *
 * @function
 * @param {string} nameAtt attribute to compare
 * @param {string|number} value regular expression
 * @return {M.Filter} filter
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
 * Less Than operator
 * @function
 * @param {string} nameAtt atribute to compare
 * @param {string|number} value value to compare
 * @return {M.Filter} filter
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
 * Greater Than operator
 * @function
 * @param {string} nameAtt atribute to compare
 * @param {string|number} value value to compare
 * @return {M.Filter} filter
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
 * Less Than or Equal operator
 * @function
 * @param {string} nameAtt atribute to compare
 * @param {string|number} value value to compare
 * @return {M.Filter} filter
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
 * Greater Than or Equal operator
 * @function
 * @param {string} nameAtt atribute to compare
 * @param {string|number} value value to compare
 * @return {M.Filter} filter
 * @api
 */
export const GTE = (nameAtt, value) => {
  return new FilterFunction((feature) => {
    return feature.getAttribute(nameAtt) != null && feature.getAttribute(nameAtt) >= value;
  }, {
    cqlFilter: `${nameAtt} >= '${value}'`,
  });
};
