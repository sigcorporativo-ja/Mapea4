/**
 * @module M/layer/GeoPackageTile
 */
import GeoPackageTileImpl from 'impl/layer/GeoPackageTile.js';
import exception from '../exception/exception.js';
import { isNullOrEmpty, isUndefined } from '../util/Utils.js';
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
