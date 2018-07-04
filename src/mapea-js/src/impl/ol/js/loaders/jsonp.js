import FacadeObject from "facade/js/object";
import FacadeRemote from "facade/js/utils/remote";
import Exception from "facade/js/exception/exception";
import Utils from "facade/js/utils/utils";



/**
 * @namespace M.impl.control
 */
export default class JSONP extends FacadeObject {
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
    return (new Promise((success, fail) => {
      Remote.get(this.url_).then((response) => {
        if (!Utils.isNullOrEmpty(response.text)) {
          let features = this.format_.read(response.text, {
            featureProjection: projection
          });
          success.call(this, [features]);
        } else {
          Exception('No hubo respuesta del servicio');
        }
      }.bind(this));
    }.bind(this)));
  }
}
