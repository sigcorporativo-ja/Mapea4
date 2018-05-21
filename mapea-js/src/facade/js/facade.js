goog.provide('M.facade.Base');

goog.require('M.Object');

(function() {
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
  M.facade.Base = (function(impl) {
    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.impl_ = impl;

    if (!M.utils.isNullOrEmpty(this.impl_) && M.utils.isFunction(this.impl_.setFacadeObj)) {
      this.impl_.setFacadeObj(this);
    }

    // calls the super constructor
    goog.base(this);
  });
  goog.inherits(M.facade.Base, M.Object);

  /**
   * This function provides the implementation
   * of the object
   *
   * @public
   * @function
   * @returns {Object}
   * @api stable
   */
  M.facade.Base.prototype.getImpl = function() {
    return this.impl_;
  };

  /**
   * This function set implementation of this control
   *
   * @public
   * @function
   * @param {M.Map} impl to add the plugin
   * @api stable
   */
  M.facade.Base.prototype.setImpl = function(impl) {
    this.impl_ = impl;
  };

  /**
   * This function destroy this object and
   * its implementation
   *
   * @public
   * @function
   * @api stable
   */
  M.facade.Base.prototype.destroy = function() {
    if (!M.utils.isNullOrEmpty(this.impl_) && M.utils.isFunction(this.impl_.destroy)) {
      this.impl_.destroy();
    }
  };

})();
