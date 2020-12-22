/**
 * @module M/layer/MBTiles
 */
import MBTilesImpl from 'impl/layer/MBTiles.js';
import LayerBase from './Layer.js';
import { isFunction, isNullOrEmpty, isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from './Type.js';
import mbtiles from '../parameter/mbtiles.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a MBTiles layer
 * with parameters specified by the user
 * @api
 */
class MBTiles extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create MBTiles
    if (isUndefined(MBTilesImpl)) {
      Exception(getValue('exception').mbtiles_method);
    }

    const parameters = { ...mbtiles(userParameters), source: userParameters.source };

    /**
     * Implementation of this layer
     * @public
     * @type {M/impl/layer/MBTilesVector}
     */
    const impl = new MBTilesImpl(userParameters, options, vendorOptions);

    // calls the super constructor
    super(parameters, impl);

    /**
     * MBTiles url
     * @public
     * @type {string}
     */
    this.url = parameters.url;

    /**
     * MBTiles name
     * @public
     * @type {string}
     */
    this.name = parameters.name;

    /**
     * MBTiles legend
     * @public
     * @type {string}
     */
    this.legend = parameters.legend;

    /**
     * MBTiles options
     * @public
     * @type {object}
     */
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.MBTiles;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.MBTiles)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.MBTiles).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Calculates the maxExtent of this layer, being the first value found in this order:
   * 1. checks if the user specified a maxExtent parameter for the layer.
   * 2. gets the maxExtent from the layer mbtile file.
   * 3. gets the maxExtent of the map.
   * 4. gets the maxExtent from the map projection.
   *
   * @function
   * @param {Object} callbackFn Optional callback function
   * @return {Array<number>} Max extent of the layer
   * @api
   */
  getMaxExtent(callbackFn) {
    let maxExtent;
    if (isNullOrEmpty(this.userMaxExtent)) { // 1
      this.getImpl().getExtentFromProvider().then((mbtilesExtent) => {
        if (isNullOrEmpty(mbtilesExtent)) { // 2
          if (isNullOrEmpty(this.map_.userMaxExtent)) { // 3
            const projMaxExtent = this.map_.getProjection().getExtent();
            this.maxExtent_ = projMaxExtent; // 4
          } else {
            this.maxExtent_ = this.map_.userMaxExtent;
            maxExtent = this.maxExtent_;
          }
        } else {
          this.maxExtent_ = mbtilesExtent;
        }
        if (isFunction(callbackFn)) {
          callbackFn(this.maxExtent_);
        }
      });
    } else {
      maxExtent = this.userMaxExtent;
    }
    if (!isNullOrEmpty(maxExtent) && isFunction(callbackFn)) {
      callbackFn(maxExtent);
    } else if (isNullOrEmpty(maxExtent)) {
      maxExtent = this.maxExtent_;
    }
    return maxExtent;
  }

  /**
   * Async version of getMaxExtent.
   * @function
   * @return {Promise} - Promise object represents the maxExtent of the layer
   * @api
   */
  calculateMaxExtent() {
    return new Promise(resolve => this.getMaxExtent(resolve));
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof MBTiles) {
      equals = this.name === obj.name;
    }
    return equals;
  }
}

export default MBTiles;
