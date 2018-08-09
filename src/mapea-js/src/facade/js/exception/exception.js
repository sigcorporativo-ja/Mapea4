/**
 * @module M/exception
 */

/**
 * This function throws an Error with message.
 * @function
 * @public
 * @param {string} msg - Message error
 * @api
 */
const exception = (msg) => {
  throw msg;
};

export default exception;
