/**
 * @module M/layer/WMTS
 */
import WMTSImpl from 'impl/layer/WMTS';
import { isUndefined, isNullOrEmpty } from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';

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
   * This functions retrieves a Promise which will be
   * resolved when the GetCapabilities request is retrieved
   * by the service and parsed. The capabilities is cached in
   * order to prevent multiple requests
   *
   * @function
   * @api
   */
  getCapabilities() {
    if (isNullOrEmpty(this.getCapabilitiesPromise_)) {
      this.getCapabilitiesPromise_ = this.getImpl().getCapabilities();
    }
    return this.getCapabilitiesPromise_;
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

    if (obj instanceof WMTS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.matrixSet === obj.matrixSet);
    }

    return equals;
  }

  /**
   * @function
   * @public
   * @api
   */
  getGetFeatureInfoUrl(coordinate, zoom, formatInfo) {
    return this.getImpl().getGetFeatureInfoUrl(coordinate, zoom, formatInfo);
  }
  /**
   * @function
   * @public
   * @api
   */
  getTileColTileRow(coordinate, zoom) {
    return this.getImpl().getTileColTileRow(coordinate, zoom);
  }
}

export default WMTS;
