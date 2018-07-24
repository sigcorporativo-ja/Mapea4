import MObject from 'facade/js/Object';
import Remote from 'facade/js/util/Remote';
import Exception from 'facade/js/exception/exception';
import Utils from 'facade/js/util/Utils';

/**
 * @namespace M.impl.control
 */
export default class JSONP extends MObject {
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
     * @type {M.format.GeoJSON}
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
        callback.apply(this, response);
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
    return new Promise((success) => {
      Remote.get(this.url_).then((response) => {
        if (!Utils.isNullOrEmpty(response.text)) {
          const features = this.format_.read(response.text, {
            featureProjection: projection,
          });
          success.call(this, [features]);
        }
        else {
          Exception('No hubo respuesta del servicio');
        }
      });
    });
  }
}
