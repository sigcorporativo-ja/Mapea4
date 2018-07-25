import Config from 'configuration';
import WMCImpl from 'impl/layer/WMC';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import LayerType from './Type';
import * as parameter from '../parameter/parameter';
import EvtManager from '../event/Manager';

export default class WMC extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMC} userParameters parameters
   * provided by the user
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
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
    if (Utils.isUndefined(WMCImpl)) {
      Exception('La implementación usada no puede crear capas WMC');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    // options
    this.options = options;

    // checks if the name is auto-generated
    if (!Utils.isNullOrEmpty(this.url) && Utils.isNullOrEmpty(this.name)) {
      this.generateName_();
    }
    // checks if it is predefined context
    else if (Utils.isNullOrEmpty(this.url) && !Utils.isNullOrEmpty(this.name)) {
      const predefinedIdx = Config.predefinedWMC.predefinedNames.indexOf(this.name);
      if (predefinedIdx === -1) {
        Exception(`El contexto predefinido '${this.name}'no existe`);
      }
      else {
        this.url = Config.predefinedWMC.urls[predefinedIdx];
        this.name = Config.predefinedWMC.names[predefinedIdx];
      }
    }

    /**
     * 'loaded' This property indicates if the layers is loaded and all its layers.
     * @type {bool}
     * @private
     * @api stable
     */
    this.loaded_ = false;

    this.once(EvtManager.LOAD, () => {
      this.loaded = true;
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
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMC)) {
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
  get maxExtent() {
    return this.getImpl().maxExtent;
  }

  set maxExtent(newMaxExtent) {
    this.getImpl().maxExtent = newMaxExtent;
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
   * @api stable
   */
  select() {
    // checks if the implementation can manage select method
    if (Utils.isUndefined(this.getImpl().select)) {
      Exception('La implementación usada no posee el método select');
    }

    this.getImpl().select();
  }

  /**
   * This function unselect this WMC layer and
   * removes all its layers
   *
   * @function
   * @api stable
   */
  unselect() {
    // checks if the implementation can manage select method
    if (Utils.isUndefined(this.getImpl().unselect)) {
      Exception('La implementación usada no posee el método unselect');
    }

    this.getImpl().unselect();
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
   * @api stable
   */
  isLoaded() {
    return this.loaded_;
  }

  /**
   * This function returns if the layer is loaded
   *
   * @function
   * @api stable
   */
  setLoaded(loaded) {
    this.loaded_ = loaded;
  }
}
