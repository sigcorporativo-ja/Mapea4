/**
 * @module M/impl/loader/KML
 */
import MObject from 'M/Object';
import { get as getRemote } from 'M/util/Remote';
import { isNullOrEmpty } from 'M/util/Utils';
import FacadeFeature from 'M/feature/Feature';
import Exception from 'M/exception/exception';
/**
 * @classdesc
 * @api
 * @namespace M.impl.control
 */
class KML extends MObject {
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
    return ((extent, resolution, projection) => {
      this.loadInternal_(projection).then((response) => {
        callback(response);
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
    return new Promise((success, fail) => {
      getRemote(this.url_).then((response) => {
        if (!isNullOrEmpty(response.text)) {
          const features = this.format_.readCustomFeatures(response.text, {
            featureProjection: projection,
          });
          const screenOverlay = this.format_.getScreenOverlay();
          const mFeatures = features.map((olFeature) => {
            const feature = new FacadeFeature(olFeature.getId(), {
              geometry: {
                coordinates: olFeature.getGeometry().getCoordinates(),
                type: olFeature.getGeometry().getType(),
              },
              properties: olFeature.getProperties(),
            });
            feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
            return feature;
          });

          success({
            features: mFeatures,
            screenOverlay,
          });
        } else {
          Exception('No hubo respuesta del KML');
        }
      });
    });
  }
}

export default KML;
