import GeosearchControlImpl from './geosearch/geosearchcontrol.js';

export default class GeosearchByCoordinatesControl extends GeosearchControlImpl {
  /**
   * @classdesc
   * Main constructor of the Geosearchbylocation control.
   *
   * @constructor
   * @param {string} searchUrl_ - URL for the request
   * @extends {GeosearchControlImpl}
   * @api stable
   */

  constructor(searchUrl_) {
    // calls super
    super({
      layerName: GeosearchByCoordinatesControl.NAME,
    });

    /**
     * Popup showed
     * @private
     * @type {Mx.Popup}
     */
    this.popup_ = null;

    /**
     * URL for the query
     * @private
     * @type {string}
     */
    this.searchUrl_ = searchUrl_;

    /**
     * Feature
     * @private
     */
    this.positionFeature_ = new M.Feature();
    this.positionFeature_.setStyle(new M.style.Point({
      fill: {
        color: '#3399CC',
      },
      radius: 6,
      stroke: {
        color: '#fff',
        width: 3,
      },
    }));
  }

  /**
   * Set the map instance the control is associated with.
   * @param {ol.Map} map - The map instance.
   * @public
   * @function
   * @api stable
   */
  setMap(map) {
    super.setMap(map);

    if (M.utils.isNullOrEmpty(map)) {
      this.facadeMap_.getImpl().removeFeatures([this.positionFeature_]);
    } else {
      this.map = map;
    }
  }

  /**
   * This function draw point location
   * @param {array} coord - Coordinates
   * @public
   * @function
   * @api stable
   */
  drawLocation(coord) {
    this.positionFeature_.getImpl()
      .getOLFeature().setGeometry(coord ? new ol.geom.Point(coord) : null);
    this.facadeMap_.drawFeatures([this.positionFeature_]);
  }

  /**
   * This function shows the container with the results
   *
   * @public
   * @function
   * @param {HTMLElement} container HTML to display
   * @api stable
   */
  addResultsContainer(container) {
    const mapContainer = this.map.getTargetElement();
    mapContainer.appendChild(container);
  }

  /**
   * This function destroy the container with the results
   *
   * @public
   * @function
   * @param {HTMLElement} container HTML results panel
   * @api stable
   */
  removeResultsContainer(container) {
    if (container !== null && container.parentElement != null) {
      container.parentElement.removeChild(container);
    }
  }

  /**
   * Zoom Results
   *
   * @public
   * @function
   * @api stable
   */
  zoomToResultsAll() {
    const bbox = this.facadeMap_.getControls('geosearchbycoordinates')[0].getImpl().getLayer().getFeaturesExtent();
    this.facadeMap_.setBbox(bbox);
  }

  /**
   * This function destroys this control and clear HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.clear();
    this.facadeMap_.removeFeatures([this.positionFeature_]);
    this.popup_ = null;
    this.searchUrl_ = null;
  }

  deactivate() {
    this.facadeMap_.removeFeatures(this.positionFeature_);
  }

  /**
   * Template for popup
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}
