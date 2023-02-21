import Geosearchlayer from '../../../facade/js/geosearchlayer.js';

/**
 * @namespace M.impl.control
 */
export default class GeosearchControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the measure conrol.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(options = {}) {
    super();
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
    this.layer_ = new Geosearchlayer({
      name: options.layerName || '__geosearch_plugin_layer_name__',
    });
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;

    map.addLayers(this.layer_);
    this.element = element;
    const control = new ol.control.Control({
      element,
      target: null,
    });
    map.getMapImpl().addControl(control);
  }

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {boolean} keepPopup to draw
   * @api stable
   */
  unselectResults(keepPopup) {
    this.layer_.getImpl().unselectFeatures(keepPopup);
  }

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {boolean} keepPopup to draw
   * @api stable
   */
  setNewResultsAsDefault() {
    this.layer_.getImpl().setNewResultsAsDefault();
  }

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {Array<Object>} results to draw
   * @api stable
   */
  drawResults(results) {
    this.layer_.getImpl().drawResults(results);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  drawNewResults(results) {
    this.layer_.getImpl().drawNewResults(results);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  zoomToResults() {
    const bbox = ol.extent.boundingExtent(this.layer_.getImpl().getOLLayer()
      .getSource().getFeatures()
      .map((feature) => {
        return ol.extent.getCenter(feature.getGeometry().getExtent());
      }));
    this.facadeMap_.setBbox(bbox);
  }

  /**
   * This function returns the layer used
   *
   * @public
   * @function
   * @returns {ol.layer.Vector}
   * @api stable
   */
  getLayer() {
    return this.layer_;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  resultClick(solrid) {
    this.layer_.getImpl().selectFeatureBySolrid(solrid);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  hideHelp() {
    if (!M.utils.isNullOrEmpty(this.helpHtml_)) {
      this.facadeMap_.getMapImpl().getTargetElement().removeChild(this.helpHtml_);
      this.helpHtml_ = null;
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  showHelp(helpHtml) {
    const overlayContainer = this.facadeMap_.getMapImpl().getTargetElement();
    if (!M.utils.isNullOrEmpty(this.helpHtml_)) {
      overlayContainer.removeChild(this.helpHtml_);
    }
    this.helpHtml_ = helpHtml;
    overlayContainer.appendChild(this.helpHtml_);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  clear() {
    this.layer_.clear();
  }

  /**
   * This function destroys this control, clearing the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.clear();
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].classList.remove('top-extra');
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
    this.helpHtml_ = null;
    this.layer_ = null;
  }
}
