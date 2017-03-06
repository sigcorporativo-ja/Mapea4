goog.provide('M.polyfills');

(function () {
   'use strict';

   /**
    * String.trim()
    * This adds trim function to String natively
    * @expose
    */
   if (!"".trim) {
      /**
       *
       * @public
       * @function
       * @api stable
       */
      (function () {
         // Make sure we trim BOM and NBSP
         var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
         String.prototype.trim = function () {
            return this.replace(rtrim, '');
         };
      })();
   }

   /**
    * Array.forEach()
    *
    * This adds forEach function to Array natively
    *
    * Production steps of ECMA-262, Edition 5, 15.4.4.18
    * Reference: http://es5.github.com/#x15.4.4.18
    * @expose
    */
   if (![].forEach) {
      /**
       *
       * @public
       * @function
       * @api stable
       */
      Array.prototype.forEach = function forEach(callback, thisArg) {
         var T, k;

         if (this === null) {
            throw new TypeError("this is null or not defined");
         }

         var kValue,
            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            O = Object(this),

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            len = O.length >>> 0; // Hack to convert O.length to a UInt32

         // 4. If IsCallable(callback) is false, throw a TypeError exception.
         // See: http://es5.github.com/#x9.11
         if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
         }

         // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
         if (arguments.length >= 2) {
            T = thisArg;
         }

         // 6. Let k be 0
         k = 0;

         // 7. Repeat, while k < len
         while (k < len) {

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

               // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
               kValue = O[k];

               // ii. Call the Call internal method of callback with T as the this value and
               // argument list containing kValue, k, and O.
               callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
         }
         // 8. return undefined
      };
   }

   /**
    * Array.filter()
    *
    * This adds filter function to Array natively
    * @expose
    */
   if (![].filter) {
      /**
       *
       * @public
       * @function
       * @api stable
       */
      Array.prototype.filter = function (fun /*, thisArg*/ ) {
         if (this === void 0 || this === null) {
            throw new TypeError();
         }

         var t = Object(this);
         var len = t.length >>> 0;
         if (typeof fun !== 'function') {
            throw new TypeError();
         }

         var res = [];
         var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
         for (var i = 0; i < len; i++) {
            if (i in t) {
               var val = t[i];

               // NOTA: Tecnicamente este Object.defineProperty deben en 
               //        el indice siguiente, como push puede ser 
               //        afectado por la propiedad en object.prototype y 
               //        Array.prototype.
               //       Pero estos metodos nuevos, y colisiones deben ser
               //       raro, así que la alternativas mas compatible.       
               if (fun.call(thisArg, val, i, t)) {
                  res.push(val);
               }
            }
         }

         return res;
      };
   }

   /**
    * Array.includes()
    *
    * This adds includes function to Array natively.
    * An optional equals function can be specified in order to
    * compare elements using that function
    * @expose
    */
   if (![].includes) {
      /**
       *
       * @public
       * @function
       * @api stable
       */
      Array.prototype.includes = function (searchElement /*, fromIndex*/ ) {
         var O = Object(this);
         var len = parseInt(O.length) || 0;
         if (len === 0) {
            return false;
         }
         var n = parseInt(arguments[1]) || 0;
         var k;
         if (n >= 0) {
            k = n;
         }
         else {
            k = len + n;
            if (k < 0) {
               k = 0;
            }
         }
         var currentElement;
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
       * @api stable
       */
      Array.prototype.remove = function (elementToRemove) {
         var O = Object(this);
         var len = parseInt(O.length) || 0;
         if (len === 0) {
            return false;
         }
         var n = parseInt(arguments[1]) || 0;
         var k;
         if (n >= 0) {
            k = n;
         }
         else {
            k = len + n;
            if (k < 0) {
               k = 0;
            }
         }
         var idxsToRemove = [];
         var currentElement;
         while (k < len) {
            currentElement = O[k];
            if (elementToRemove === currentElement || Object.equals(elementToRemove, currentElement) ||
               (elementToRemove !== elementToRemove && currentElement !== currentElement)) {
               idxsToRemove.push(k);
            }
            k++;
         }
         // removes elements
         var offset = 0;
         idxsToRemove.forEach(function (idx) {
            idx += offset;
            O.splice(idx, 1);
            offset--;
         });
      };
   }

   /**
    * Array.map()
    *
    * This adds map function to Array natively
    *
    * Production steps of ECMA-262, Edition 5, 15.4.4.19
    * Reference: http://es5.github.io/#x15.4.4.19
    * @expose
    */
   if (![].map) {
      /**
       *
       * @public
       * @function
       * @api stable
       */
      Array.prototype.map = function (callback, thisArg) {

         var T, A, k;

         if (this === null) {
            throw new TypeError(' this is null or not defined');
         }

         // 1. Let O be the result of calling ToObject passing the |this| 
         //    value as the argument.
         var O = Object(this);

         // 2. Let lenValue be the result of calling the Get internal 
         //    method of O with the argument "length".
         // 3. Let len be ToUint32(lenValue).
         var len = O.length >>> 0;

         // 4. If IsCallable(callback) is false, throw a TypeError exception.
         // See: http://es5.github.com/#x9.11
         if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
         }

         // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
         if (arguments.length > 1) {
            T = thisArg;
         }

         // 6. Let A be a new array created as if by the expression new Array(len) 
         //    where Array is the standard built-in constructor with that name and 
         //    len is the value of len.
         A = new Array(len);

         // 7. Let k be 0
         k = 0;

         // 8. Repeat, while k < len
         while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal 
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

               // i. Let kValue be the result of calling the Get internal 
               //    method of O with argument Pk.
               kValue = O[k];

               // ii. Let mappedValue be the result of calling the Call internal 
               //     method of callback with T as the this value and argument 
               //     list containing kValue, k, and O.
               mappedValue = callback.call(T, kValue, k, O);

               // iii. Call the DefineOwnProperty internal method of A with arguments
               // Pk, Property Descriptor
               // { Value: mappedValue,
               //   Writable: true,
               //   Enumerable: true,
               //   Configurable: true },
               // and false.

               // In browsers that support Object.defineProperty, use the following:
               // Object.defineProperty(A, k, {
               //   value: mappedValue,
               //   writable: true,
               //   enumerable: true,
               //   configurable: true
               // });

               // For best browser support, use the following:
               A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
         }

         // 9. return A
         return A;
      };
   }

   /**
    * Object.equals()
    *
    * This adds map function to check equals object
    * @expose
    */
   if (!Object.equals) {
      /**
       *
       * @public
       * @function
       * @api stable
       */
      Object.equals = function (obj1, obj2) {
         if (obj1.equals !== null && ((typeof obj1.equals === 'function') && obj1.equals.call)) {
            return obj1.equals(obj2);
         }
         else if (obj2.equals !== null && ((typeof obj2.equals === 'function') && obj2.equals.call)) {
            return obj2.equals(obj1);
         }
         else {
            var leftChain = [],
               rightChain = [];
            var p;

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
               }
               else if (typeof obj2[p] !== typeof obj1[p]) {
                  return false;
               }
            }

            for (p in obj1) {
               if (obj2.hasOwnProperty(p) !== obj1.hasOwnProperty(p)) {
                  return false;
               }
               else if (typeof obj2[p] !== typeof obj1[p]) {
                  return false;
               }

               switch (typeof (obj1[p])) {
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
})();