/**
 * @module M/layer/WMTS
 */
import WMTSImpl from 'impl/layer/WMTS.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import LayerBase from './Layer.js';
import * as parameter from '../parameter/parameter.js';
import * as LayerType from './Type.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMTS layer
 * with parameters specified by the user
 * @api
 */
class WMTS extends LayerBase {
  /**
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMTS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMTS}
     */
    const impl = new WMTSImpl(options, vendorOptions);

    // This Layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.WMTS);

    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create WMTS layers
    if (isUndefined(WMTSImpl)) {
      Exception(getValue('exception').wmts_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    // matrixSet
    this.matrixSet = parameters.matrixSet;

    // legend
    this.legend = parameters.legend;

    // transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.WMTS;
  }
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.WMTS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMTS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }
  /**
   * 'matrixSet' the layer matrix set
   */
  get matrixSet() {
    return this.getImpl().matrixSet;
  }

  set matrixSet(newMatrixSet) {
    this.getImpl().matrixSet = newMatrixSet;
  }

  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.getImpl().legend;
  }

  set legend(newLegend) {
    if (isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * 'options' the layer options
   */
  get options() {
    return this.getImpl().options;
  }

  set options(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * Creates a Promise which will be
   * resolved when the GetCapabilities request is retrieved
   * by the service and parsed. The capabilities is cached in
   * order to prevent multiple requests
   *
   * @function
   * @return {Promise} Promise object representing Capabilities
   * @api
   */
  getCapabilities() {
    if (isNullOrEmpty(this.getCapabilitiesPromise_)) {
      this.getCapabilitiesPromise_ = this.getImpl().getCapabilities();
    }
    return this.getCapabilitiesPromise_;
  }

  /**
   * Checks if an object is equal to this layer. Two WMTS layers are equal if both of them are
   * WMTS instances and have the same url, name and matrixset.
   *
   * @function
   * @return {Promise} Promise object representing
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof WMTS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.matrixSet === obj.matrixSet);
    }

    return equals;
  }

  /**
   * Generates a WMTS getFeatureInfo url that can be used to query the server
   *
   * @function
   * @public
   * @param {Array<Number>} coordinate Coordinate to query
   * @param {Number} zoom Zoom level
   * @param {string} formatInfo Format requested for the response
   * @return {string} getFeatureInfo url
   * @api
   */
  getGetFeatureInfoUrl(coordinate, zoom, formatInfo) {
    return this.getImpl().getGetFeatureInfoUrl(coordinate, zoom, formatInfo);
  }
  /**
   * Gets the tile column and tile row of a coordinate
   * @function
   * @public
   * @param {Array<Number>} coordinate Coordinate to query
   * @param {Number} zoom Zoom level
   * @return {Array<Number>} Array with the tile and col numbers
   * @api
   */
  getTileColTileRow(coordinate, zoom) {
    return this.getImpl().getTileColTileRow(coordinate, zoom);
  }
}

export default WMTS;
