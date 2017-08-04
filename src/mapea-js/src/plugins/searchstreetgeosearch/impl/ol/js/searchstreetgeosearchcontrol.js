goog.provide('P.impl.control.SearchstreetGeosearch');

/**
 * @namespace M.impl.control
 */
(function() {
  /**
   * @classdesc Main constructor of the SearchstreetGeosearch control.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  M.impl.control.SearchstreetGeosearch = function() {
    /**
     * Facade of the map
     *
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * HTML template
     *
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;

  };
  goog.inherits(M.impl.control.SearchstreetGeosearch, ol.control.Control);

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Template of this control
   * @api stable
   */
  M.impl.control.SearchstreetGeosearch.prototype.addTo = function(map, element) {
    this.facadeMap_ = map;
    this.element_ = element;

    ol.control.Control.call(this, {
      'element': element,
      'target': null
    });
    map.getMapImpl().addControl(this);
  };

  /**
   * This function return HTML template
   *
   * @public
   * @function
   * @api stable
   * @returns {HTMLElement}
   */
  M.impl.control.SearchstreetGeosearch.prototype.getElement = function() {
    return this.element_;
  };

  /**
   * This function zoom results
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.SearchstreetGeosearch.prototype.zoomResults = function() {
    let bbox = this.facadeMap_.getControls().find(c => c.name_ === "searchstreetgeosearch").ctrlGeosearch.getImpl().layer_.getFeaturesExtent();
    if (!M.utils.isNullOrEmpty(bbox)) {
      this.facadeMap_.setBbox(bbox);
    }
  };

  /**
   * This function destroys this control and clearing the HTML
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.SearchstreetGeosearch.prototype.destroy = function() {
    goog.dom.classlist.remove(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
      "top-extra");
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_.getImpl().removePopup();
    this.facadeMap_ = null;
    this.element_ = null;
  };

})();
