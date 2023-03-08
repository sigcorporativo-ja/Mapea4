export default class SearchstreetGeosearch extends M.impl.Control {
  /**
   * @classdesc Main constructor of the SearchstreetGeosearch control.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor() {
    super();

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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    this.element_ = element;
    super.addTo(map, element);


    // const control = new ol.control.Control({
    //   element,
    //   target: null,
    // });
    // map.getMapImpl().addControl(control);
  }

  /**
   * This function return HTML template
   *
   * @public
   * @function
   * @api stable
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element_;
  }

  /**
   * This function zoom results
   *
   * @public
   * @function
   * @api stable
   */
  zoomResults() {
    const control = this.facadeMap_.getControls().find(c => c.name === 'searchstreetgeosearch');
    const bbox = control.ctrlGeosearch.getImpl().getLayer().getFeaturesExtent();
    if (!M.utils.isNullOrEmpty(bbox)) {
      this.facadeMap_.setBbox(bbox);
    }
  }

  /**
   * This function destroys this control and clearing the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].classList.remove('top-extra');
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_.getImpl().removePopup();
    this.facadeMap_ = null;
    this.element_ = null;
  }

  /**
   * TODO
   */
  getLayer() {
    return this.layer_;
  }
}
