export default class Quantification {
  /** This function returns a jenks quantification function
   * @function
   * @public
   * @param {number} n_classes_param - Number of classes
   * @return {function}
   * @api stable
   */

  static JENKS(n_classes_paramVar) {
    const n_classes_param = n_classes_paramVar;
    n_classes_param = n_classes_param || Quantification.DEFAULT_CLASES_JENKS;

    const jenksFn = (data, n_classes = n_classes_param) => {
      let uniqueData = Quantification.uniqueArray_(data);
      n_classes = uniqueData.length <= n_classes ? uniqueData.length - 1 : n_classes;
      // sort data in numerical order, since this is expected
      // by the matrices function
      data.sort((a, b) => {
        return a - b;
      });

      // get our basic matrices
      const matrices = Quantification.getMatrices_(data, n_classes);
      // we only need lower class limits here
      const lower_class_limits = matrices.lower_class_limits;

      // extract n_classes out of the computed matrices
      const breaks = Quantification.jenksBreaks_(data, lower_class_limits, n_classes);
      // No cogemos el minimo
      const break_points = breaks.slice(1, breaks.length);
      return break_points;
    };

    Object.defineProperty(jenksFn, 'name', {
      value: 'jenks',
    });

    return jenksFn;
  }

  /** This function returns a quantile quantification function
   * @function
   * @public
   * @param {number} n_classes_param - Number of classes
   * @return {function}
   * @api stable
   */
  static QUANTILE(n_classes_param) {
    n_classes_param = n_classes_param || Quantification.DEFAULT_CLASES_QUANTILE;
    const quantileFn = (data, n_classes = n_classes_param) => {
      const uniqueData = Quantification.uniqueArray_(data);
      n_classes = uniqueData.length <= n_classes ? uniqueData.length - 1 : n_classes;
      const numData = data.length;
      data.sort((a, b) => a - b);
      const [min, max] = [data[0], data[numData - 1]];

      // Calculamos el salto para calcular los puntos de ruptura
      // Esto será (valor minimo + valor máximo) / número de clases
      const step = (min + max) / n_classes;
      const breaks = [];

      // Calculamos los puntos de ruptura multiplicando por el valor
      // del salto desde i = 1, 2, .. numero de clases - 1
      for (let value = 0; value < n_classes.length; value += 1) {
        const break_point = step * value;
        breaks.push(break_point);
      }
      breaks.push(max);
      return breaks;
    };

    Object.defineProperty(quantileFn, 'name', {
      value: 'quantile'
    });
    return quantileFn;
  };

  /**
   *  Compute the matrices required for Jenks breaks. These matrices
   * can be used for any classing of data with `classes <= n_classes`
   * @function
   * @private
   * @api stable
   *
   */
  static getMatrices_(data, n_classes) {
    // in the original implementation, these matrices are referred to
    // as `LC` and `OP`
    //
    // * lower_class_limits (LC): optimal lower class limits
    // * variance_combinations (OP): optimal variance combinations for all classes
    const lower_class_limits = [];
    const variance_combinations = [];
    // the variance, as computed at each step in the calculation
    let variance = 0;

    // Initialize and fill each matrix with zeroes
    for (let i = 0; i < data.length + 1; i += 1) {
      const tmp1 = [];
      const tmp2 = [];
      for (let j = 0; j < n_classes + 1; j += 1) {
        tmp1.push(0);
        tmp2.push(0);
      }
      lower_class_limits.push(tmp1);
      variance_combinations.push(tmp2);
    }

    for (let i = 1; i < n_classes + 1; i += 1) {
      lower_class_limits[1][i] = 1;
      variance_combinations[1][i] = 0;
      // in the original implementation, 9999999 is used but
      // since Javascript has `Infinity`, we use that.
      for (let j = 2; j < data.length + 1; j += 1) {
        variance_combinations[j][i] = Infinity;
      }
    }

    for (let l = 2; l < data.length + 1; l += 1) {

      // `SZ` originally. this is the sum of the values seen thus
      // far when calculating variance.
      let sum = 0;
      let sum_squares = 0;
      let w = 0;
      let i4 = 0;

      // in several instances, you could say `Math.pow(x, 2)`
      // instead of `x * x`, but this is slower in some browsers
      // introduces an unnecessary concept.
      for (let m = 1; m < l + 1; m += 1) {

        // `III` originally
        let lower_class_limit = (l - m) + 1;
        const val = data[lower_class_limit - 1];

        // here we're estimating variance for each potential classing
        // of the data, for each potential number of classes. `w`
        // is the number of data points considered so far.
        w += 1;

        // increase the current sum and sum-of-squares
        sum += val;
        sum_squares += val * val;

        // the variance at this point in the sequence is the difference
        // between the sum of squares and the total x 2, over the number
        // of samples.
        variance = (sum_squares - (sum * sum)) / w;

        i4 = lower_class_limit - 1;

        if (i4 !== 0) {
          for (let j = 2; j < n_classes + 1; j += 1) {
            // if adding this element to an existing class
            // will increase its variance beyond the limit, break
            // the class at this point, setting the lower_class_limit
            // at this point.
            if (variance_combinations[l][j] >=
              (variance + variance_combinations[i4][j - 1])) {
              lower_class_limits[l][j] = lower_class_limit;
              variance_combinations[l][j] = variance +
                variance_combinations[i4][j - 1];
            }
          }
        }
      }

      lower_class_limits[l][1] = 1;
      variance_combinations[l][1] = variance;
    }

    // return the two matrices. for just providing breaks, only
    // `lower_class_limits` is needed, but variances can be useful to
    // evaluage goodness of fit.
    return {
      lower_class_limits,
      variance_combinations,
    };
  }

  /**
   * This function take the calculated matrices
   * and derive an array of n breaks.
   * @function
   * @private
   * @api stable
   */

  static jenksBreaks_(data, lower_class_limits, n_classes) {

    let k = data.length - 1;
    const kclass = [];
    let countNum = n_classes;

    // the calculation of classes will never include the upper and
    // lower bounds, so we need to explicitly set them
    kclass[n_classes] = data[data.length - 1];
    kclass[0] = data[0];

    // the lower_class_limits matrix is used as indexes into itself
    // here: the `k` variable is reused in each iteration.
    while (countNum > 1) {
      kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
      k = lower_class_limits[k][countNum] - 1;
      countNum -= 1;
    }

    return kclass;
  }

  /**
   * This function takes an array and creates a unique element array with it.
   * @function
   * @private
   * @param {Array} array - array of elements
   * @return {Array}
   * @api stable
   */

  static uniqueArray_(array) {
    const uniqueArray = [];
    array.forEach((elem) => {
      if (uniqueArray.indexOf(elem) === -1) {
        uniqueArray.push(elem);
      }
    });
    return uniqueArray;
  }
}

/**
 * @constant
 * @api stable
 */
Quantification.DEFAULT_CLASES_JENKS = 5;
/**
 * @constant
 * @api stable
 */
Quantification.DEFAULT_CLASES_QUANTILE = 5;
