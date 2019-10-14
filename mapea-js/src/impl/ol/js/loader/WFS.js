/**
 * @module M/impl/loader/WFS
 */
import MObject from 'M/Object';
import { get as getRemote } from 'M/util/Remote';
import { isNullOrEmpty } from 'M/util/Utils';
import Exception from 'M/exception/exception';
import * as Dialog from 'M/dialog';
import { getValue } from 'M/i18n/language';
/**
 * @classdesc
 * @api
 * @namespace M.impl.control
 */
class WFS extends MObject {
  /**
   * @classdesc TODO
   * control
   * @param {function} element template of this control
   * @param {M.Map} map map to add the plugin
   * @constructor
   * @extends {M.Object}
   * @api stable
   */
  constructor(map, service, format) {
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
    this.service_ = service;

    /**
     * TODO
     * @private
     * @type {M.impl.format.GeoJSON | M.impl.format.GML}
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
      const requestUrl = this.getRequestUrl_(extent, projection);
      this.loadInternal_(requestUrl, projection).then(callback.bind(this));
    });
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  loadInternal_(url, projection) {
    return new Promise((success, fail) => {
      getRemote(url).then((response) => {
        if (!isNullOrEmpty(response.text) && response.text.indexOf('ServiceExceptionReport') < 0) {
          const features = this.format_.read(response.text, projection);
          success(features);
        } else if (response.code === 401) {
          Dialog.error(getValue('dialog').unauthorized_user);
        } else if (response.text.indexOf('featureId and cql_filter') >= 0) {
          Dialog.error(getValue('dialog').only_one_filter);
        } else {
          Exception(getValue('exception').no_getfeature_response);
        }
      });
    });
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  getRequestUrl_(extent, projection) {
    // var mapBbox = this.map_.getBbox();
    // var minExtent = [
    //    Math.min(Math.abs(extent[0]), mapBbox.x.min),
    //    Math.min(Math.abs(extent[1]), mapBbox.y.min),
    //    Math.min(Math.abs(extent[2]), mapBbox.x.max),
    //    Math.min(Math.abs(extent[3]), mapBbox.y.max)
    // ];

    // return this.service_.getFeatureUrl(minExtent, projection);
    return this.service_.getFeatureUrl(null, projection);
  }
}

export default WFS;
