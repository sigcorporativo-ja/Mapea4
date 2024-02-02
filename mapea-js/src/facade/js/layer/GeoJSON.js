/**
 * @module M/layer/GeoJSON
 */
import GeoJSONImpl from 'impl/layer/GeoJSON.js';
import LayerVector from './Vector.js';
import { GeoJSON as GeoJSONType } from './Type.js';
import { isString, isNullOrEmpty, isUndefined, isArray } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a GeoJSON layer
 * with parameters specified by the user
 * @api
 */
class GeoJSON extends LayerVector {
  /**
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.GeoJSON} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(parameters, options = {}, vendorOptions) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.GeoJSON}
     */
    const impl = new GeoJSONImpl(parameters, options, vendorOptions);

    // calls the super constructor
    super(parameters, options, undefined, impl);

    // checks if the implementation can create KML layers
    if (isUndefined(GeoJSONImpl)) {
      Exception(getValue('exception').geojsonlayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(parameters)) {
      Exception(getValue('exception').no_param);
    }

    if (isString(parameters)) {
      this.url = parameters;
    } else if (isArray(parameters)) {
      this.source = parameters;
    } else {
      // url
      this.url = parameters.url;

      // name
      this.name = parameters.name;

      // source
      this.source = parameters.source;

      // crs
      if (!isNullOrEmpty(parameters.crs)) {
        if (isNullOrEmpty(this.source)) {
          this.source = {
            type: 'FeatureCollection',
            features: [],
          };
        }
        this.source.crs = {
          type: 'EPSG',
          properties: {
            code: parameters.crs,
          },
        };
      }
    }

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return GeoJSONType;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== GeoJSONType)) {
      Exception('El tipo de capa debe ser \''.concat(GeoJSONType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'extract' the features properties
   */
  get source() {
    return this.getImpl().source;
  }

  set source(newSource) {
    this.getImpl().source = newSource;
  }

  /**
   * Checks if an object is equal to this layer. Two GeoJSON layers are equal if both of them are
   * GeoJSON instances and have the same 'name' and 'extract' attributes
   *
   * @function
   * @param {Object} obj Object to to comapre
   * @return {boolean} True if equal, false otherwise
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof GeoJSON) {
      equals = this.name === obj.name;
      equals = equals && (this.extract === obj.extract);
      equals = equals && (this.template === obj.template);
      equals = equals && (this.id === obj.id);
    }

    return equals;
  }

  /**
   * Sets the source of the layer, in GeoJSON format
   *
   * @function
   * @param {Object} source GeoJSON representation of the layer
   * @api
   */
  setSource(source) {
    this.source = source;
    this.getImpl().refresh(source);
  }

  /**
   * Sets the style of the layer
   *
   * @function
   * @public
   * @param {M.Style} style Style to set
   * @param {bool} [applyToFeature=false] True if set at feature level, false to set atlayer level
   * @api
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = GeoJSON.DEFAULT_OPTIONS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
  }
}

/**
 * Default params for style GeoJSON layers * @const
 * @type {object}
 * @public
 * @api
 */
GeoJSON.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};

/**
 * Default style for GeoJSON layers
 * @const
 * @type {object}
 * @public
 * @api
 */
GeoJSON.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...GeoJSON.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...GeoJSON.DEFAULT_PARAMS,
  },
  polygon: {
    ...GeoJSON.DEFAULT_PARAMS,
  },
};

export default GeoJSON;
