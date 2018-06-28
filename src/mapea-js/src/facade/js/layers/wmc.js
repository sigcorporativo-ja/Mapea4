import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import LayerBase from('./layerbase.js');
import LayerType from('./layertype.js');
import WMCImpl from('../../../impl/js/layers/wmc.js');
import Layer from('../parameters/layers.js');
import Config from('../../../configuration.js');

export class WMC extends LayerBase {
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
    // calls the super constructor
    super(this, parameters, impl);
    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(WMCImpl)) {
      Exception('La implementación usada no puede crear capas WMC');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    options = (options || {});
    //This Layer is of parameters
    let parameters = Layer(userParameters, LayerType.WMC);

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMC}
     */
    let impl = new WMCImpl(options);


    // options
    this.options = options;

    // checks if the name is auto-generated
    if (!Utils.isNullOrEmpty(this.url) && Utils.isNullOrEmpty(this.name)) {
      this.generateName_();
    }
    // checks if it is predefined context
    else if (Utils.isNullOrEmpty(this.url) && !Utils.isNullOrEmpty(this.name)) {
      var predefinedIdx = Config.predefinedWMC.predefinedNames.indexOf(this.name);
      if (predefinedIdx === -1) {
        Exception('El contexto predefinido \'' + this.name + '\' no existe');
      } else {
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

    this.once(Evt.LOAD, () => this.loaded_ = true);
  }

  /**
   * 'selected' This property indicates if
   * the layer was selected
   */

  get selected() {
    return this.impl().selected;
  }

  set selected(newSelectedValue) {
    this.impl().selected = newSelectedValue;
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
    return this.impl().layers;
  }

  set layers(newLayers) {
    this.impl().layers = newLayers;
  }

  /**
   * Projection provided by the WMC file
   */
  get projection() {
    return this.impl().projection;
  }

  set projection(newProjection) {
    this.impl().projection = newProjection;
  }

  /**
   * Max extent provided by the WMC file
   */
  get maxExtent() {
    return this.impl().maxExtent;
  }

  set maxExtent(newMaxExtent) {
    this.impl().maxExtent = newMaxExtent;
  }

  /**
   * 'options' resolutions specified by the user
   */
  get options() {
    return this.impl().options;
  }

  set options(newOptions) {
    this.impl().options = newOptions;
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
    if (Utils.isUndefined(this.impl().select)) {
      Exception('La implementación usada no posee el método select');
    }

    this.impl().select();
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
    if (Utils.isUndefined(this.impl().unselect)) {
      Exception('La implementación usada no posee el método unselect');
    }

    this.impl().unselect();
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
