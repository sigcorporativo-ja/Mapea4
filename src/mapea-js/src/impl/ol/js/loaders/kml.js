import FacadeGeoJSON from "facade/js/format/geojson";
import FacadeObject from "facade/js/object.js";
import FacadeRemote from "facade/js/utils/remote";
import Utils from "facade/js/utils/utils";
import FacadeFeature from "facade/js/feature/feature";
import Exception from "facade/js/exception/exception";


/**
 * @namespace M.impl.control
 */
export default class KML extends FacadeObject {
  /**
   * @classdesc TODO
   * control
   * @param {function} element template of this control
   * @param {M.Map} map map to add the plugin
   * @constructor
   * @extends {M.Object}
   * @api stable
   */
  constructor(map, url, format) {
    super();

    /**
     * TODO
     * @private
     * @type {M.Map}
     */
    this.map_ = map;

    /**
     * TODO
     * @private
     * @type {M.impl.service.WFS}
     */
    this.url_ = url;

    /**
     * TODO
     * @private
     * @type {M.impl.format.GeoJSON}
     */
    this.format_ = format;

  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  getLoaderFn(callback) {
    let loaderScope = this;
    return ((extent, resolution, projection) => {
      let sourceScope = this;
      loaderScope.loadInternal_(projection).then((response) => {
        callback.apply(sourceScope, response);
      });
    });
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  loadInternal_(projection) {
    let this_ = this;
    return (new Promise((success, fail) => {
      FacadeRemote.get(this_.url_).then((response) => {
        if (!Utils.isNullOrEmpty(response.text)) {
          let features = this_.format_.readFeatures(response.text, {
            featureProjection: projection
          });
          let screenOverlay = this_.format_.getScreenOverlay();
          success.call(this, [
            features.map(olFeature => {
              let feature = new FacadeFeature(olFeature.getId(), {
                geometry: {
                  coordinates: olFeature.getGeometry().getCoordinates(),
                  type: olFeature.getGeometry().getType()
                },
                properties: olFeature.getProperties()
              });
              feature.getImpl().getOLFeature().style = olFeature.getStyle();
              return feature;
            }), screenOverlay]);
        } else {
          Exception('No hubo respuesta del KML');
        }
      });
    }));
  }

}
