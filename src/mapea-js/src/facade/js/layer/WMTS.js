import WMTSImpl from 'impl/ol/js/layer/WMTS';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as parameter from '../parameter/parameter';
import LayerType from './Type';

export default class WMTS extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMTS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMTS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(userParameters, options = {}) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMTS}
     */
    const impl = new WMTSImpl(options);

    // This Layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.WMTS);

    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create WMTS layers
    if (Utils.isUndefined(WMTSImpl)) {
      Exception('La implementación usada no puede crear capas WMTS');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
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
  static get type() {
    return LayerType.WMTS;
  }
  static set type(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMTS)) {
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
    if (Utils.isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    }
    else {
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
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
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
}
