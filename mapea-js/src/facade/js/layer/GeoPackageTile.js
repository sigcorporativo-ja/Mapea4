/**
 * @module M/layer/GeoPackageTile
 */
import GeoPackageTileImpl from 'impl/layer/GeoPackageTile.js';
import exception from '../exception/exception.js';
import { isFunction, isNullOrEmpty, isUndefined } from '../util/Utils.js';
import LayerBase from './Layer.js';
import { GeoPackageTile as GeoPackageTileType } from './Type';

/**
 * @classdesc
 * Main constructor of the class. Creates a Geopackage layer
 * with parameters specified by the user*
 * @api
 */
class GeoPackageTile extends LayerBase {
  /**
   * @constructor
   * @extends {MObject}
   * @api
   */
  constructor(userParameters, provider) {
    const impl = new GeoPackageTileImpl(userParameters, provider);

    // calls the super constructor
    super(userParameters, impl);
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return GeoPackageTileType;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== GeoPackageTileType)) {
      exception('El tipo de capa debe ser \''.concat(GeoPackageTileType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
    if (obj instanceof GeoPackageTile) {
      equals = this.name === obj.name;
    }

    return equals;
  }
}

export default GeoPackageTile;
