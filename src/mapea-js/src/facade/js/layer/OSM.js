/**
 * @module M/layer/OSM
 */
import OSMImpl from 'impl/layer/OSM';
import LayerBase from './Layer';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from './Type';
import * as parameter from '../parameter/parameter';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMS layer
 * with parameters specified by the user
 * @api
 */
class OSM extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api
   */
  constructor(userParametersVar, options = {}) {
    let userParameters = userParametersVar;
    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */
    const impl = new OSMImpl(userParameters, options);
    // This layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.OSM);

    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create OSM
    if (isUndefined(OSMImpl)) {
      Exception('La implementación usada no puede crear capas OSM');
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      userParameters = 'OSM';
    }

    if (isNullOrEmpty(parameters.name)) {
      parameters.name = 'osm';
    }

    this.name = parameters.name;

    this.legend = parameters.legend;
    if (isNullOrEmpty(parameters.legend)) {
      this.legend = 'OpenStreetMap';
    }

    // transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;
  }

  /**
   * 'transparent' the layer name
   */
  get transparent() {
    return this.getImpl().transparent;
  }

  set transparent(newTransparent) {
    if (!isNullOrEmpty(newTransparent)) {
      this.getImpl().transparent = newTransparent;
    } else {
      this.getImpl().transparent = false;
    }
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.OSM;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.OSM)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.OSM).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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

    if (obj instanceof OSM) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}

export default OSM;
