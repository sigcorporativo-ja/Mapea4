/**
 * @module M/facade
 */
import { isNullOrEmpty, isFunction } from './util/Utils';
import MObject from './Object';

/**
 * @classdesc
 * Main facade Object. This class creates a facede
 * Object which has an implementation Object and
 * provides the needed methods to access its implementation
 * @api
 */
class Base extends MObject {
  /**
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

    if (!isNullOrEmpty(this.impl_) && isFunction(this.impl_.setFacadeObj)) {
      this.impl_.setFacadeObj(this);
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
  getImpl() {
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
  setImpl(value) {
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
    if (!isNullOrEmpty(this.impl_) && isFunction(this.impl_.destroy)) {
      this.impl_.destroy();
    }
  }
}

export default Base;
