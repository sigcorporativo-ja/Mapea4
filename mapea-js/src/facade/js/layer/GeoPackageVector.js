/**
 * @module M/layer/GeoPackageVector
 */
import GeoPackageVectorImpl from 'impl/layer/GeoPackageVector.js';
import Vector from './Vector.js';
import { GeoPackageVector as GeoPackageVectorType } from './Type';
import { isNullOrEmpty, isUndefined } from '../util/Utils.js';
import exception from '../exception/exception.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a Geopackage layer
 * with parameters specified by the user*
 * @api
 */
class GeoPackageVector extends Vector {
  /**
   * @constructor
   * @extends {MObject}
   * @api
   */
  constructor(userParameters) {
    const impl = new GeoPackageVectorImpl(userParameters);

    // calls the super constructor
    super(userParameters, impl);
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return GeoPackageVectorType;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== GeoPackageVectorType)) {
      exception('El tipo de capa debe ser \''.concat(GeoPackageVectorType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
    if (obj instanceof GeoPackageVector) {
      equals = this.name === obj.name;
    }

    return equals;
  }
}

export default GeoPackageVector;
