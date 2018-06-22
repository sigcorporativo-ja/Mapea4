import Object from "./object.js";
import Utils from "./utils/utils.js"

export class Base extends Object {
  /**
   * @classdesc
   * Main facade Object. This class creates a facede
   * Object which has an implementation Object and
   * provides the needed methods to access its implementation
   *
   * @constructor
   * @param {Object} impl implementation object
   * @extends {M.Object}
   * @api stable
   */

  constructor(impl) {

    // calls the super constructor
    super();

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.impl_ = impl;

    if (!Utils.isNullOrEmpty(this.impl_) && Utils.isFunction(this.impl_.facadeObj)) {
      this.impl_.facadeObj = this;
    }

  }

  /**
   * This function provides the implementation
   * of the object
   *
   * @public
   * @function
   * @returns {Object}
   * @api stable
   */
  get impl() {
    return this.impl_;
  }

  /**
   * This function set implementation of this control
   *
   * @public
   * @function
   * @param {M.Map} impl to add the plugin
   * @api stable
   */
  set impl(value) {
    this.impl_ = value;
  }

  /**
   * This function destroy this object and
   * its implementation
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    if (!Utils.isNullOrEmpty(this.impl_) && Utils.isFunction(this.impl_.destroy)) {
      this.impl_.destroy();
    }
  };

}
