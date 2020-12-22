/**
 * @module M/layer/MBTilesVector
 */
import MBTilesVectorImpl from 'impl/layer/MBTilesVector.js';
import RenderFeatureImpl from 'impl/feature/RenderFeature.js';
import Vector from './Vector.js';
import mbtilesvector from '../parameter/mbtilesvector.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { MBTilesVector as MBTilesVectorType } from './Type.js';

/**
 * Possibles modes of MBTilesVector
 *
 * @const
 * @public
 * @api
 */
export const mode = {
  RENDER: 'render',
  FEATURE: 'feature',
};

/**
 * @classdesc
 * Main constructor of the class. Creates a MBTilesVector layer
 * with parameters specified by the user
 * @api
 */
class MBTilesVector extends Vector {
  constructor(userParameters = {}, options = {}, vendorOptions = {}) {
    const parameters = { ...mbtilesvector(userParameters), source: userParameters.source };

    const impl = new MBTilesVectorImpl(parameters, options, vendorOptions);
    super(parameters, options, vendorOptions, impl);

    if (isUndefined(MBTilesVectorImpl)) {
      Exception('La implementación usada no puede crear capas Vector');
    }
  }

  /**
   * @getter
   * @api
   */
  get type() {
    return MBTilesVectorType;
  }

  /**
   * @setter
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== MBTilesVectorType)) {
      Exception('El tipo de capa debe ser \''.concat(MBTilesVectorType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * This method calculates the maxExtent of this layer:
   * 1. Check if the user specified a maxExtent parameter
   * 2. Gets the map maxExtent
   * 3. Sets the maxExtent from the map projection
   *
   * @function
   * @api
   */
  getMaxExtent() {
    let maxExtent = this.userMaxExtent; // 1
    if (isNullOrEmpty(maxExtent)) {
      maxExtent = this.map_.userMaxExtent; // 2
      if (isNullOrEmpty(maxExtent)) {
        maxExtent = this.map_.getProjection().getExtent(); // 3
      }
    }
    return maxExtent;
  }

  /**
   * This method calculates the maxExtent of this layer:
   * 1. Check if the user specified a maxExtent parameter
   * 2. Gets the map maxExtent
   * 3. Sets the maxExtent from the map projection
   * Async version of getMaxExtent
   *
   * @function
   * @api
   */
  calculateMaxExtent() {
    return new Promise(resolve => resolve(this.getMaxExtent()));
  }

  /**
   * This function sets the style to layer
   *
   * @function
   * @public
   * @param {M.Style}
   * @param {bool}
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = MBTilesVector.DEFAULT_OPTIONS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
  }

  /**
   * This function gets the projection of the map.
   * @function
   * @public
   * @api
   */
  getProjection() {
    return this.getImpl().getProjection();
  }

  /**
   * Gets the geometry type of the layer.
   * @function
   * @public
   * @return {string} geometry type of layer
   * @api
   */
  getGeometryType() {
    let geometry = null;
    const features = this.getFeatures();
    if (!isNullOrEmpty(features)) {
      const firstFeature = features[0];
      if (!isNullOrEmpty(firstFeature)) {
        geometry = firstFeature.getType();
      }
    }
    return geometry;
  }

  /**
   * Returns all features.
   *
   * @function
   * @public
   * @return {Array<M.RenderFeature>} Features
   * @api
   */
  getFeatures() {
    const features = this.getImpl().getFeatures();

    return features.map(olFeature => RenderFeatureImpl.olFeature2Facade(olFeature));
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

    if (obj instanceof MBTilesVector) {
      equals = this.name === obj.name;
    }
    return equals;
  }

  setFilter() {}

  addFeatures() {}

  removeFeatures() {}

  refresh() {}

  redraw() {}

  toGeoJSON() {}
}

/**
 * Style options by default for this layer
 *
 * @const
 * @type {object}
 * @public
 * @api
 */
MBTilesVector.DEFAULT_OPTIONS_STYLE = {
  fill: {
    color: '#fff',
    opacity: 0.6,
  },
  stroke: {
    color: '#827ec5',
    width: 2,
  },
  radius: 5,
};

export default MBTilesVector;
