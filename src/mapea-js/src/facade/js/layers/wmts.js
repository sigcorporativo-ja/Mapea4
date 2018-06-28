import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import LayerBase from('./layerbase.js');
import WMTSImpl from('../../../impl/js/layers/wmts.js');
import Layer from('../parameters/layers.js');
import LayerType from('./layertype.js');

export class WMTS extends LayerBase {
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
    // calls the super constructor
    super(this, parameters, impl);
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
    let impl = new WMTSImpl(options);

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
  get type() {
    return LayerType.WMTS;
  }
  set type(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMTS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMTS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }
  /**
   * 'matrixSet' the layer matrix set
   */
  get matrixSet() {
    return this.impl().matrixSet;
  }

  set matrixSet(newMatrixSet) {
    this.impl().matrixSet = newMatrixSet;
  }

  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.impl().legend;
  }

  set legend(newLegend) {
    if (Utils.isNullOrEmpty(newLegend)) {
      this.impl().legend = this.name;
    } else {
      this.impl().legend = newLegend;
    }
  }

  /**
   * 'options' the layer options
   */

  get options() {
    return this.impl().options;
  }

  set options(newOptions) {
    this.impl().options = newOptions;
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
