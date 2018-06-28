import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Layer from('../parameters/layers.js');
import Base from('../facade.js');
import Config from('../../../configuration.js');

export class LayerBase extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @api stable
   */
  constructor(userParameters, impl) {
    // calls the super constructor
    super(this, impl);

    //This layer is of parameters.
    let parameter = Layer(userParameters);

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.type = parameter.type;

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.url = parameter.url;

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.name = parameter.name;

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.transparent = parameter.transparent;

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.zindex_ = null;
  }

  /**
   * 'options' the layer options
   */
  static get options() {
    return this.impl().options;
  }

  static set options(newOptions) {
    this.impl().options = newOptions;
  }

  /**
   * 'url' The service URL of the
   * layer
   */
  static get url() {
    return this.impl().url;
  }

  static set url(newUrl) {
    this.impl().url = newUrl;
  }


  /**
   * 'name' the layer name
   */
  static get name() {
    return this.impl().name;
  }

  static set name(newName) {
    this.impl().name = newName;
  }

  /**
   * 'transparent' the layer transparence
   */

  static get transparent() {
    return this.impl().transparent;
  }

  static set transparent(newTransparent) {
    if (!Utils.isNullOrEmpty(newTransparent)) {
      if (Utils.isString(newTransparent)) {
        this.impl().transparent = (Utils.normalize(newTransparent) === 'true');
      } else {
        this.impl().transparent = newTransparent;
      }
    } else {
      this.impl().transparent = true;
    }
  }

  /**
   * 'displayInLayerSwitcher' the layer transparence
   */
  static get displayInLayerSwitcher() {
    return this.impl().displayInLayerSwitcher;
  }

  static set displayInLayerSwitcher(newDisplayInLayerSwitcher) {
    if (!Utils.isNullOrEmpty(newDisplayInLayerSwitcher)) {
      if (Utils.isString(newDisplayInLayerSwitcher)) {
        this.impl().displayInLayerSwitcher = (Utils.normalize(newDisplayInLayerSwitcher) === 'true');
      } else {
        this.impl().displayInLayerSwitcher = newDisplayInLayerSwitcher;
      }
    } else {
      this.impl().displayInLayerSwitcher = true;
    }
  }

  /**
   * This function indicates if the layer is visible
   *
   * @function
   * @api stable
   * @export
   */
  isVisible() {
    // checks if the implementation can manage this method
    if (Utils.isUndefined(this.impl().isVisible)) {
      Exception('La implementación usada no posee el método isVisible');
    }

    return this.impl().isVisible();
  }

  /**
   * This function indicates if the layer is visible
   *
   * @function
   * @api stable
   * @export
   */
  isQueryable() {
    // checks if the implementation can manage this method
    if (Utils.isUndefined(this.impl().isQueryable)) {
      Exception('La implementación usada no posee el método isQueryable');
    }

    return this.impl().isQueryable();
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @export
   */
  set visible(visibility) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(visibility)) {
      Exception('No ha especificado ningún parámetro de visibilidad');
    }

    // checks if the param is boolean or string
    if (!Utils.isString(visibility) && !Utils.isBoolean(visibility)) {
      Exception('No ha especificado ningún parámetro de visibilidad');
    }

    // checks if the implementation can manage this method
    if (Utils.isUndefined(this.impl().setVisible)) {
      Exception('La implementación usada no posee el método setVisible');
    }

    visibility = /^1|(true)$/i.test(visibility);

    this.impl().visible = visibility;
  }

  /**
   * This function indicates if the layer is in range
   *
   * @function
   * @api stable
   * @export
   */
  inRange() {
    // checks if the implementation can manage this method
    if (Utils.isUndefined(this.impl().inRange)) {
      Exception('La implementación usada no posee el método inRange');
    }

    return this.impl().inRange();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  get legendURL() {
    return this.impl().legendURL();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  set legendURL(legendUrl) {
    if (Utils.isNullOrEmpty(legendUrl)) {
      legendUrl = Utils.concatUrlPaths([M.config.THEME_URL, M.Layer.LEGEND_DEFAULT]);
    }
    this.impl().legendURL = legendUrl;
  }

  /**
   * This function gets the z-index of this layer
   *
   * @function
   * @api stable
   */
  get ZIndex() {
    return this.zindex_;
  }

  /**
   * This function sets the z-index for this layer
   *
   * @function
   * @api stable
   */
  set ZIndex(zIndex) {
    this.zindex_ = zIndex;
    this.impl().ZIndex = zIndex;
  }

  /**
   * This function gets the opacity of this layer
   *
   * @function
   * @api stable
   */
  get opacity() {
    return this.impl().opacity();
  }

  /**
   * This function sets the opacity of this layer
   *
   * @function
   * @api stable
   */
  set opacity(opacity) {
    this.impl().opacity = opacity;
  }

  /**
   * This function refreshes the state of this
   * layer
   *
   * @function
   * @api stable
   * @export
   */
  refresh() {
    // checks if the implementation can manage this method
    if (!Utils.isUndefined(this.impl().refresh) && Utils.isFunction(this.impl().refresh)) {
      this.impl().refresh();
    }
  }

  /**
   * This function auto-generates a name for this layer
   * @private
   * @function
   * @export
   */
  generateName_() {
    this.name = Utils.generateRandom('layer_', '_'.concat(this.type));
  }

  /**
   * Image PNG for legend default
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  LayerBase.LEGEND_DEFAULT = '/img/legend-default.png';

  /**
   * Image PNG for legend default
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  LayerBase.LEGEND_ERROR = '/img/legend-error.png';
}
