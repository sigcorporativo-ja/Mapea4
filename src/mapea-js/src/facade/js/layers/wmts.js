import Utils from '../utils/utils';
import Exception from '../exception/exception';
import LayerBase from './layerbase';
import WMTSImpl from '../../../impl/js/layers/wmts';
import Layer from '../parameters/layers';
import LayerType from './layertype';

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
  constructor(userParameters, options) {
    let impl = new WMTSImpl(options);

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

    options = (options || {});

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMTS}
     */

    //This Layer is of parameters.
    let parameters = Layer(userParameters, LayerType.WMTS);


    // matrixSet
    this.matrixSet = parameters.matrixSet;

    // legend
    this.legend = parameters.legend;

    //transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  getType() {
    return LayerType.WMTS;
  }
  setType(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMTS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMTS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }
  /**
   * 'matrixSet' the layer matrix set
   */
  getMatrixSet() {
    return this.getImpl().matrixSet;
  }

  setMatrixSet(newMatrixSet) {
    this.getImpl().matrixSet = newMatrixSet;
  }

  /**
   * 'legend' the layer name
   */
  getLegend() {
    return this.getImpl().legend;
  }

  setLegend(newLegend) {
    if (Utils.isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * 'options' the layer options
   */

  getOptions() {
    return this.getImpl().options;
  }

  setOptions(newOptions) {
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
