import Config from 'configuration';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import * as parserParameter from '../parameter/parameter';
import Base from '../Base';

export default class LayerBase extends Base {
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
    super(impl);

    // This layer is of parameters.
    const parameter = parserParameter.layer(userParameters);

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
   * 'url' The service URL of the
   * layer
   */
  get url() {
    return this.getImpl().url;
  }

  set url(newUrl) {
    this.getImpl().url = newUrl;
  }

  /**
   * 'name' the layer name
   */
  get name() {
    return this.getImpl().name;
  }

  set name(newName) {
    this.getImpl().name = newName;
  }

  /**
   * 'transparent' the layer transparence
   */
  get transparent() {
    return this.getImpl().transparent;
  }

  set transparent(newTransparent) {
    if (!Utils.isNullOrEmpty(newTransparent)) {
      if (Utils.isString(newTransparent)) {
        this.getImpl().transparent = (Utils.normalize(newTransparent) === 'true');
      }
      else {
        this.getImpl().transparent = newTransparent;
      }
    }
    else {
      this.getImpl().transparent = true;
    }
  }

  /**
   * 'displayInLayerSwitcher' the layer transparence
   */
  get displayInLayerSwitcher() {
    return this.getImpl().displayInLayerSwitcher;
  }

  set displayInLayerSwitcher(newDisplayInLayerSwitcher) {
    if (!Utils.isNullOrEmpty(newDisplayInLayerSwitcher)) {
      if (Utils.isString(newDisplayInLayerSwitcher)) {
        this.getImpl().displayInLayerSwitcher = (Utils.normalize(newDisplayInLayerSwitcher) === 'true');
      }
      else {
        this.getImpl().displayInLayerSwitcher = newDisplayInLayerSwitcher;
      }
    }
    else {
      this.getImpl().displayInLayerSwitcher = true;
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
    if (Utils.isUndefined(this.getImpl().isVisible)) {
      Exception('La implementación usada no posee el método isVisible');
    }

    return this.getImpl().isVisible();
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
    if (Utils.isUndefined(this.getImpl().isQueryable)) {
      Exception('La implementación usada no posee el método isQueryable');
    }

    return this.getImpl().isQueryable();
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @export
   */
  setVisible(visibilityParam) {
    let visibility = visibilityParam;
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(visibility)) {
      Exception('No ha especificado ningún parámetro de visibilidad');
    }

    // checks if the param is boolean or string
    if (!Utils.isString(visibility) && !Utils.isBoolean(visibility)) {
      Exception('No ha especificado ningún parámetro de visibilidad');
    }

    // checks if the implementation can manage this method
    if (Utils.isUndefined(this.getImpl().setVisible)) {
      Exception('La implementación usada no posee el método setVisible');
    }

    visibility = /^1|(true)$/i.test(visibility);

    this.getImpl().visible = visibility;
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
    if (Utils.isUndefined(this.getImpl().inRange)) {
      Exception('La implementación usada no posee el método inRange');
    }

    return this.getImpl().inRange();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  getLegendURL() {
    return this.getImpl().getLegendURL();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  setLegendURL(legendUrlParam) {
    let legendUrl = legendUrlParam;
    if (Utils.isNullOrEmpty(legendUrl)) {
      legendUrl = Utils.concatUrlPaths([Config.THEME_URL, LayerBase.LEGEND_DEFAULT]);
    }
    this.getImpl().setLegendURL(legendUrl);
  }

  /**
   * This function gets the z-index of this layer
   *
   * @function
   * @api stable
   */
  getZIndex() {
    return this.zindex_;
  }

  /**
   * This function sets the z-index for this layer
   *
   * @function
   * @api stable
   */
  setZIndex(zIndex) {
    this.zindex_ = zIndex;
    this.getImpl().setZIndex(zIndex);
  }

  /**
   * This function gets the opacity of this layer
   *
   * @function
   * @api stable
   */
  getOpacity() {
    return this.getImpl().getOpacity();
  }

  /**
   * This function sets the opacity of this layer
   *
   * @function
   * @api stable
   */
  setOpacity(opacity) {
    this.getImpl().opacity = opacity;
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
    if (!Utils.isUndefined(this.getImpl().refresh) && Utils.isFunction(this.getImpl().refresh)) {
      this.getImpl().refresh();
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
