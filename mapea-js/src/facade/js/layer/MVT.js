/**
 * @module M/layer/MVT
 */
import MVTTileImpl from 'impl/layer/MVT.js';
import RenderFeatureImpl from 'impl/feature/RenderFeature.js';
import Vector from './Vector.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { MVT as MVTType } from './Type.js';

/**
 * Possibles modes of MVT
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
 * Main constructor of the class. Creates a MVT layer
 * with parameters specified by the user
 * @api
 */
class MVT extends Vector {
  constructor(parameters = {}, options = {}, vendorOptions = {}, implParam) {
    const impl = implParam || new MVTTileImpl(parameters, options, vendorOptions);
    super(parameters, options, vendorOptions, impl);

    if (isUndefined(MVTTileImpl)) {
      Exception('La implementación usada no puede crear capas Vector');
    }
  }

  /**
   * @getter
   * @api
   */
  get type() {
    return MVTType;
  }

  /**
   * @setter
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== MVTType)) {
      Exception('El tipo de capa debe ser \''.concat(MVTType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * This function sets 
   * the tileLoadFunction
   * On the implementation
   *
   * @function
   * @public
   * @param {Function} func Function to override
   * @api
   */
  setTileLoadFunction(func){
    this.getImpl().setTileLoadFunction(func);
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
  setStyle(styleParam, applyToFeature = false, defaultStyle = MVT.DEFAULT_OPTIONS_STYLE) {
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
   * Removes the style of the layer, both at layer and at feature level
   *
   * @function
   * @public
   * @api
   */
  clearStyle() {
    this.setStyle(null);
  }

  setFilter() {}
  addFeatures() {}
  removeFeatures() {}
  refresh() {}
  redraw() {}
  toGeoJSON() {}
}

/**
 * Params options by default for MVT layer *
 * @const
 * @type {object}
 * @public
 * @api
 */
MVT.DEFAULT_PARAMS_STYLE = {
  fill: {
    color: '#fff',
    opacity: 0.6,
  },
  stroke: {
    color: '#827ec5',
    width: 2,
  },
};
/**
 * Style options by default for this layer
 *
 * @const
 * @type {object}
 * @public
 * @api
 */
MVT.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...MVT.DEFAULT_PARAMS_STYLE,
    radius: 5,
  },
  line: {
    ...MVT.DEFAULT_PARAMS_STYLE,
  },
  polygon: {
    ...MVT.DEFAULT_PARAMS_STYLE,
  },
};


export default MVT;
