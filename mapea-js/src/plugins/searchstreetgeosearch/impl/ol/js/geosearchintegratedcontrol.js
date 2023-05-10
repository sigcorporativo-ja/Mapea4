import GeosearchControlImpl from '../../../../geosearch/impl/ol/js/geosearchcontrol.js';

export default class GeosearchIntegrated extends GeosearchControlImpl {
  /**
   * This function replaces the addto of Geosearch not to add control
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {function} element - Template SearchstreetGeosearch control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;

    map.addLayers(this.layer_);
  }

  /**
   *  This function cancels the zoom function of Geosearch
   *
   * @private
   * @function
   */
  zoomToResults() {}
}
