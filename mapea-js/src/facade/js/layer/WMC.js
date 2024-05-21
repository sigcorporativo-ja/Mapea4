/**
 * @module M/layer/WMC
 */

import WMCImpl from 'impl/layer/WMC.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import LayerBase from './Layer.js';
import * as LayerType from './Type.js';
import * as parameter from '../parameter/parameter.js';
import * as EventType from '../event/eventtype.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC layer
 * with parameters specified by the user
 * @api
 */
class WMC extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMC} userParameters parameters
   * provided by the user
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api
   */
  constructor(userParameters, options) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMC}
     */
    const impl = new WMCImpl(options);

    // This Layer is of parameters
    const parameters = parameter.layer(userParameters, LayerType.WMC);

    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create WMC layers
    if (isUndefined(WMCImpl)) {
      Exception(getValue('exception').wmclayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    // options
    this.options = options;

    // checks if the name is auto-generated
    if (!isNullOrEmpty(this.url) && isNullOrEmpty(this.name)) {
      this.generateName_();
    } else if (isNullOrEmpty(this.url) && !isNullOrEmpty(this.name)) {
      // checks if it is predefined context
      const predefinedIdx = M.config.predefinedWMC.predefinedNames.indexOf(this.name);
      if (predefinedIdx === -1) {
        Exception(`El contexto predefinido '${this.name}'no existe`);
      } else {
        this.url = M.config.predefinedWMC.urls[predefinedIdx];
        this.name = M.config.predefinedWMC.names[predefinedIdx];
      }
    }

    /**
     * 'loaded' This property indicates if the layers is loaded and all its layers.
     * @type {bool}
     * @private
     * @api
     */
    this.loaded_ = false;

    this.once(EventType.LOAD, () => {
      this.setLoaded(true);
    });
  }

  /**
   * 'selected' This property indicates if
   * the layer was selected
   */

  get selected() {
    return this.getImpl().selected;
  }

  set selected(newSelectedValue) {
    this.getImpl().selected = newSelectedValue;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.WMC;
  }

  set type(newType) {
    if (!isUndefined(newType)
      && !isNullOrEmpty(newType) && (newType !== LayerType.WMC)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMC).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * The layers provided by the WMC file
   */
  get layers() {
    return this.getImpl().layers;
  }

  set layers(newLayers) {
    this.getImpl().layers = newLayers;
  }

  /**
   * Projection provided by the WMC file
   */
  get projection() {
    return this.getImpl().projection;
  }

  set projection(newProjection) {
    this.getImpl().projection = newProjection;
  }

  /**
   * Max extent provided by the WMC file
   */
  set maxExtent(newMaxExtent) {
    this.getImpl().maxExtent = newMaxExtent;
  }

  /**
   * This function indicates the layer max extent
   *
   * @function
   * @api
   */
  getMaxExtent(callbackFn) {
    return this.getImpl().getMaxExtent(callbackFn);
  }

  /**
   * This function indicates the layer max extent
   * Async version of getMaxExtent
   *
   * @function
   * @api
   */
  calculateMaxExtent() {
    return this.getImpl().calculateMaxExtent();
  }

  /**
   * 'options' resolutions specified by the user
   */
  get options() {
    return this.getImpl().options;
  }

  set options(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * This function select this WMC layer and
   * triggers the event to draw it
   *
   * @function
   * @api
   */
  select() {
    // checks if the implementation can manage select method
    if (isUndefined(this.getImpl().select)) {
      Exception(getValue('exception').select_method);
    }

    this.getImpl().select();
  }

  /**
   * This function unselect this WMC layer and
   * removes all its layers
   *
   * @function
   * @api
   */
  unselect() {
    // checks if the implementation can manage select method
    if (isUndefined(this.getImpl().unselect)) {
      Exception(getValue('exception').unselect_method);
    }

    this.getImpl().unselect();
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

    if (obj instanceof WMC) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }

  /**
   * This function returns if the layer is loaded
   *
   * @function
   * @api
   */
  isLoaded() {
    return this.loaded_;
  }

  /**
   * This function returns if the layer is loaded
   *
   * @function
   * @api
   */
  setLoaded(loaded) {
    this.loaded_ = loaded;
  }
}

export default WMC;
