/**
 * @namespace M.impl.control
 */
export default class SearchstreetIntegratedControl extends M.impl.control.Searchstreet {
  /**
   * This function replaces the addTo of Searchstreet, not to add control
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} template - Template SearchstreetGeosearch control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    this.element_ = element;

    ol.control.Control.call(this, {
      element,
      target: null,
    });
  }

  /**
   * This function cancels the zoom function of searchstreet
   *
   * @public
   * @function
   * @api stable
   */
  zoomResults() {}
}
