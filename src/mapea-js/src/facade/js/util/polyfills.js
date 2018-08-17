const polyfill = () => {
  /**
   * Array.includes()
   *
   * This adds includes function to Array natively.
   * An optional equals function can be specified in order to
   * compare elements using that function
   */
  /* eslint-disable */
  if (![].includes) {
    /**
     *
     * @public
     * @function
     * @api
     */
    Array.prototype.includes = (searchElement) => {
      let O = Object(this);
      let len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      let n = parseInt(arguments[1]) || 0;
      let k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      let currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement || Object.equals(searchElement, currentElement) ||
          (searchElement !== searchElement && currentElement !== currentElement)) {
          return true;
        }
        k++;
      }
      return false;
    };
  }

  /**
   * Array.remove()
   *
   * This adds remove function to Array natively
   * @expose
   */
  if (![].remove) {
    /**
     *
     * @public
     * @function
     */
    Array.prototype.remove = (elementToRemove) => {
      let O = Object(this);
      let len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      let n = parseInt(arguments[1]) || 0;
      let k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      let idxsToRemove = [];
      let currentElement;
      while (k < len) {
        currentElement = O[k];
        if (elementToRemove === currentElement || Object.equals(elementToRemove, currentElement) ||
          (elementToRemove !== elementToRemove && currentElement !== currentElement)) {
          idxsToRemove.push(k);
        }
        k++;
      }
      // removes elements
      let offset = 0;
      idxsToRemove.forEach(function(idx) {
        idx += offset;
        O.splice(idx, 1);
        offset--;
      });
    };
  }

  /**
   * Object.equals()
   *
   * This adds map function to check equals object
   */
  if (!Object.equals) {
    /**
     *
     * @public
     * @function
     */
    Object.equals = (obj1, obj2) => {
      if (obj1.equals !== null && ((typeof obj1.equals === 'function') && obj1.equals.call)) {
        return obj1.equals(obj2);
      } else if (obj2.equals !== null && ((typeof obj2.equals === 'function') && obj2.equals.call)) {
        return obj2.equals(obj1);
      } else {
        let leftChain = [],
          rightChain = [];
        let p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(obj1) && isNaN(obj2) && typeof obj1 === 'number' && typeof obj2 === 'number') {
          return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on step when comparing prototypes
        if (obj1 === obj2) {
          return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof obj1 === 'function' && typeof obj2 === 'function') ||
          (obj1 instanceof Date && obj2 instanceof Date) ||
          (obj1 instanceof RegExp && obj2 instanceof RegExp) ||
          (obj1 instanceof String && obj2 instanceof String) ||
          (obj1 instanceof Number && obj2 instanceof Number)) {
          return obj1.toString() === obj2.toString();
        }

        // At last checking prototypes as good a we can
        if (!(obj1 instanceof Object && obj2 instanceof Object)) {
          return false;
        }

        if (obj1.isPrototypeOf(obj2) || obj2.isPrototypeOf(obj1)) {
          return false;
        }

        if (obj1.constructor !== obj2.constructor) {
          return false;
        }

        if (obj1.prototype !== obj2.prototype) {
          return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(obj1) > -1 || rightChain.indexOf(obj2) > -1) {
          return false;
        }

        // Quick checking of one object beeing a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in obj2) {
          if (obj2.hasOwnProperty(p) !== obj1.hasOwnProperty(p)) {
            return false;
          } else if (typeof obj2[p] !== typeof obj1[p]) {
            return false;
          }
        }

        for (p in obj1) {
          if (obj2.hasOwnProperty(p) !== obj1.hasOwnProperty(p)) {
            return false;
          } else if (typeof obj2[p] !== typeof obj1[p]) {
            return false;
          }

          switch (typeof(obj1[p])) {
            case 'object':
            case 'function':

              leftChain.push(obj1);
              rightChain.push(obj2);

              if (!Object.equals(obj1[p], obj2[p])) {
                return false;
              }

              leftChain.pop();
              rightChain.pop();
              break;

            default:
              if (obj1[p] !== obj2[p]) {
                return false;
              }
              break;
          }
        }
        return true;
      }
    };
  }
};

// exec the polifyll
polyfill()
/* eslint-enable xxdd*/
