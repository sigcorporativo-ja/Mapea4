goog.provide('P.impl.control.Geosearch');

goog.require('P.impl.layer.Geosearch');
goog.require('goog.dom.classes');

/**
 * @namespace M.impl.control
 */
(function () {
  /**
   * @classdesc
   * Main constructor of the measure conrol.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  M.impl.control.Geosearch = function (options) {
    options = (options || {});

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * HTML element of the help
     * @private
     * @type {HTMLElement}
     */
    this.helpHtml_ = null;

    /**
     * Layer that represents the results
     * @private
     * @type {M.impl.Layer}
     */
    this.layer_ = new M.impl.layer.Geosearch(options.layerName);
  };
  goog.inherits(M.impl.control.Geosearch, M.impl.Control);

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.addTo = function (map, element) {
    this.facadeMap_ = map;

    this.layer_.addTo(map);
    map.getImpl().getFeaturesHandler().addLayer(this.layer_);

    ol.control.Control.call(this, {
      'element': element,
      'target': null
    });
    map.getMapImpl().addControl(this);
  };

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {boolean} keepPopup to draw
   * @api stable
   */
  M.impl.control.Geosearch.prototype.unselectResults = function (keepPopup) {
    this.layer_.unselectFeatures(keepPopup);
  };

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {boolean} keepPopup to draw
   * @api stable
   */
  M.impl.control.Geosearch.prototype.setNewResultsAsDefault = function () {
    this.layer_.setNewResultsAsDefault();
  };

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {Array<Object>} results to draw
   * @api stable
   */
  M.impl.control.Geosearch.prototype.drawResults = function (results) {
    this.layer_.drawResults(results);
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.drawNewResults = function (results) {
    this.layer_.drawNewResults(results);
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.zoomToResults = function () {
    var bbox = ol.extent.boundingExtent(this.layer_.getOL3Layer().getSource().getFeatures().map(function (feature) {
      return ol.extent.getCenter(feature.getGeometry().getExtent());
    }));
    this.facadeMap_.setBbox(bbox);
  };

  /**
   * This function returns the layer used
   *
   * @public
   * @function
   * @returns {ol.layer.Vector}
   * @api stable
   */
  M.impl.control.Geosearch.prototype.getLayer = function () {
    return this.layer_;
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.resultClick = function (solrid) {
    this.layer_.selectFeatureBySolrid(solrid);
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.hideHelp = function () {
    if (!M.utils.isNullOrEmpty(this.helpHtml_)) {
      this.facadeMap_.getMapImpl().getTargetElement().removeChild(this.helpHtml_);
      this.helpHtml_ = null;
    }
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.showHelp = function (helpHtml) {
    var overlayContainer = this.facadeMap_.getMapImpl().getTargetElement();
    if (!M.utils.isNullOrEmpty(this.helpHtml_)) {
      overlayContainer.removeChild(this.helpHtml_);
    }
    this.helpHtml_ = helpHtml;
    overlayContainer.appendChild(this.helpHtml_);
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.impl.control.Geosearch.prototype.clear = function () {
    this.layer_.clear();
  };

  /**
   * This function destroys this control, clearing the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.Geosearch.prototype.destroy = function () {
    this.clear();
    goog.dom.classlist.remove(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
      "top-extra");
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
    this.helpHtml_ = null;
    this.layer_ = null;
  };
})();
