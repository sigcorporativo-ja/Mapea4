/**
 * @module M/layer/GeoJSON
 */
import GeoJSONImpl from 'impl/layer/GeoJSON';
import LayerVector from './Vector';
import { GeoJSON as GeoJSONType } from './Type';
import { isString, isNullOrEmpty, isUndefined, isArray, normalize } from '../util/Utils';
import Exception from '../exception/exception';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMS layer
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
   * @api
   */
  constructor(parameters, options = {}) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.GeoJSON}
     */
    const impl = new GeoJSONImpl(parameters, options);

    // calls the super constructor
    super(parameters, options, impl);

    // checks if the implementation can create KML layers
    if (isUndefined(GeoJSONImpl)) {
      Exception('La implementación usada no puede crear capas GeoJSON');
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(parameters)) {
      Exception('No ha especificado ningún parámetro');
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

      // extract
      this.extract = parameters.extract;
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

    if (isNullOrEmpty(this.extract)) {
      this.extract = true; // by default
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
   * 'extract' the features properties
   */
  get extract() {
    return this.getImpl().extract;
  }

  set extract(newExtract) {
    if (!isNullOrEmpty(newExtract)) {
      if (isString(newExtract)) {
        this.getImpl().extract = (normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = true;
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

    if (obj instanceof GeoJSON) {
      equals = this.name === obj.name;
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  setSource(source) {
    this.source = source;
    this.getImpl().refresh(source);
  }

  /**
   * This function sets the style to layer
   *
   * @function
   * @public
   * @param {M.Style}
   * @param {bool}
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = GeoJSON.DEFAULT_OPTIONS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
  }
}

/**
 * Options style by default
 * @const
 * @type {object}
 * @public
 * @api
 */
GeoJSON.DEFAULT_OPTIONS_STYLE = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
  radius: 5,
};

export default GeoJSON;
