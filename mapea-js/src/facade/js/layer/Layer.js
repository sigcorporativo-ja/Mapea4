/**
 * @module M/Layer
 */
import Exception from '../exception/exception';
import * as parserParameter from '../parameter/parameter';
import Base from '../Base';
import { isNullOrEmpty, concatUrlPaths, isUndefined, normalize, isString, isFunction, generateRandom, isBoolean, isArray, isObject } from '../util/Utils';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Represents the root of all other types of Layers. It is not meant to be instanced, but extended.
 * @api
 */
class LayerBase extends Base {
  /**
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @api
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
     * @type {Array<number>}
     * @expose
     */
    this.maxExtent_ = null;

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.zindex_ = null;

    /**
     * @private
     * @type {M.Map}
     * @expose
     */
    this.map_ = null;

    /**
     * MaxExtent provided by the user
     * @public
     * @type {Array<Number>}
     * @api
     */
    this.userMaxExtent = parameter.maxExtent;

    /**
     * Non - identifying, readable name of layer, to use in toc
     * @public
     * @type {string}
     * @api
     */
    this.legend = parameter.legend;

    /**
     * Group Layer
     * @private
     * @api
     */
    this.layerGroup_ = null;
  }

  /**
   * Returns the legend, a non - identifying, readable name of the layer, to use in toc, etc.
   * @function
   * @api
   * @return {string} The legend of the layer.
   */

  getLegend() {
    return this.getImpl().legend;
  }

  /**
   * Sets the legend value
   * @param {string} newLegend - The new legend
   */
  setLegend(newLegend) {
    this.legend = newLegend;
    this.getImpl().legend = newLegend;
  }

  /**
   * Returns the service URL of the layer
   * @return {string} Service URL of the layer
   */
  get url() {
    return this.getImpl().url;
  }

  /**
   * Sets the Url of the layer
   * @param {string} newUrl - The new Url
   */
  set url(newUrl) {
    this.getImpl().url = newUrl;
  }

  /**
   * Returns the name of the layer name
   * @return {string} name - The internal name of the layeer
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

  /**
   *
   */
  set transparent(newTransparent) {
    if (!isNullOrEmpty(newTransparent)) {
      if (isString(newTransparent)) {
        this.getImpl().transparent = (normalize(newTransparent) === 'true');
      } else {
        this.getImpl().transparent = newTransparent;
      }
    } else {
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
    if (!isNullOrEmpty(newDisplayInLayerSwitcher)) {
      if (isString(newDisplayInLayerSwitcher)) {
        this.getImpl().displayInLayerSwitcher = (normalize(newDisplayInLayerSwitcher) === 'true');
      } else {
        this.getImpl().displayInLayerSwitcher = newDisplayInLayerSwitcher;
      }
    } else {
      this.getImpl().displayInLayerSwitcher = true;
    }
  }

  /**
   * Gets the current maxExtent of this layer:
   * 1. Checks if there is an assigned maxExtent for this layer
   * 2. If not, checks if there is an assigned maxExtent for the map
   * 3. If not, gets the maxExtent of the map projection
   *
   * @function
   * @api
   * @return {Array<Number>} - The maxExtent of the layer, as [xmin, ymin, xmax, ymax]
   */
  getMaxExtent() {
    let maxExtent = this.userMaxExtent; // 1
    if (isNullOrEmpty(maxExtent)) {
      maxExtent = this.map_.userMaxExtent; // 2
      if (isNullOrEmpty(maxExtent)) {
        maxExtent = this.map_.getProjection().getExtent(); // 3
      }
    }
    return maxExtent;
  }

  /**
   * Async version of getMaxExtent.
   * Calculates the current maxExtent of this layer:
   * 1. Checks if there is an assigned maxExtent for this layer
   * 2. If not, checks if there is an assigned maxExtent for the map
   * 3. If not, gets the maxExtent of the map projection
   *
   * @function
   * @api
   * @return {Promise} - Promise object represents the maxExtent of the layer
   */
  calculateMaxExtent() {
    return new Promise(resolve => resolve(this.getMaxExtent()));
  }

  /**
   * Sets a max extent for the layer.
   *
   * @function
   * @api
   * @export
   * @param {(Array<number>|Mx.Extent)} maxExtent - maxExtent to set
   */
  setMaxExtent(maxExtent) {
    this.userMaxExtent = maxExtent;
    if (!isArray(maxExtent) && isObject(maxExtent)) {
      this.userMaxExtent = [
        maxExtent.x.min,
        maxExtent.y.min,
        maxExtent.x.max,
        maxExtent.y.max,
      ];
    }
    if (isFunction(this.getImpl().setMaxExtent)) {
      if (isNullOrEmpty(maxExtent)) {
        this.resetMaxExtent();
      } else {
        this.getImpl().setMaxExtent(maxExtent);
      }
    }
  }

  /**
   * Resets the max extent of the layer.
   * @function
   * @api
   */
  resetMaxExtent() {
    this.userMaxExtent = null;
    this.calculateMaxExtent().then((maxExtent) => {
      if (isFunction(this.getImpl().setMaxExtent)) {
        this.getImpl().setMaxExtent(maxExtent);
      }
    });
  }

  /**
   * Sets the facade map instace
   *
   * @function
   * @public
   * @api
   * @export
   * @param {M.Map} map Facade map instance
   */
  setMap(map) {
    this.map_ = map;
  }

  /**
   * Returns the Layer Group of this layer, if any.
   *
   * @function
   * @api stable
   * @expose
   * @returns {M.LayerGroup} The Layer Group where this layer is in
   */
  getLayerGroup() {
    return this.layerGroup_;
  }

  /**
   * Puts the layer inside a LayerGroup. A layer can only be inside one LayerGroup at a time.
   *
   * @function
   * @api stable
   * @expose
   * @param {M.LayerGroup} layerGroup The Layer Group to put this layer in
   */
  setLayerGroup(layerGroup) {
    this.layerGroup_ = layerGroup;
  }


  /**
   * Returns whether the layer is visible or not.
   *
   * @function
   * @api
   * @export
   * @returns {boolean} true if visible, false otherwise
   */
  isVisible() {
    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().isVisible)) {
      Exception(getValue('exception').isvisible_method);
    }

    return this.getImpl().isVisible();
  }

  /**
   * Returns whether the layer is queryable or not.
   *
   * @function
   * @api
   * @export
   * @returns {boolean} true if queryable, false otherwise
   */
  isQueryable() {
    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().isQueryable)) {
      Exception(getValue('exception').isqueryable_method);
    }

    return this.getImpl().isQueryable();
  }

  /**
   * Sets the visibility of this layer. A non-visible layer is not drawn.
   *
   * @function
   * @api
   * @export
   * @param {boolean} visibility - true if visible, false otherwise
   */
  setVisible(visibilityParam) {
    let visibility = visibilityParam;
    // checks if the param is null or empty
    if (isNullOrEmpty(visibility)) {
      Exception(getValue('exception').visibility_param);
    }

    // checks if the param is boolean or string
    if (!isString(visibility) && !isBoolean(visibility)) {
      Exception(getValue('exception').visibility_param);
    }

    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().setVisible)) {
      Exception(getValue('exception').setvisible_method);
    }

    visibility = /^1|(true)$/i.test(visibility);

    this.getImpl().setVisible(visibility);
  }

  /**
   * Indicates if the layer is in range, that is, if the current map resolution is
   *  between the min and max resolutions of the layer.
   *
   * @function
   * @api
   * @export
   * @returns {boolean} true if in range, false otherwise
   */
  inRange() {
    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().inRange)) {
      Exception(getValue('exception').inrage_method);
    }

    return this.getImpl().inRange();
  }

  /**
   * Gets the url for the legend image of the layer.
   *
   * @function
   * @api
   * @returns {string} The url that returns the legend
   */
  getLegendURL() {
    return this.getImpl().getLegendURL();
  }

  /**
   * Sets the url of the legend image of this layer.
   *
   * @function
   * @api
   * @param {string} legendUr The url that returns the image to use as legend
   */
  setLegendURL(legendUrlParam) {
    let legendUrl = legendUrlParam;
    if (isNullOrEmpty(legendUrl)) {
      legendUrl = concatUrlPaths([M.config.THEME_URL, LayerBase.LEGEND_DEFAULT]);
    }
    this.getImpl().setLegendURL(legendUrl);
  }

  /**
   * Gets the z-index of the layer
   *
   * @function
   * @api
   * @returns {Number} Z-index of the layer
   */
  getZIndex() {
    return this.zindex_;
  }

  /**
   * Sets the z-index for this layer
   *
   * @function
   * @api
   * @param {Number} zIndex Z-index to apply
   */
  setZIndex(zIndex) {
    this.zindex_ = zIndex;
    this.getImpl().setZIndex(zIndex);
  }

  /**
   * This function gets the opacity of this layer
   *
   * @function
   * @api
   * @returns {Number} 0 to 1, where 0 is fully transparent and 1 opaque
   */
  getOpacity() {
    return this.getImpl().getOpacity();
  }

  /**
   * Sets the opacity of this layer
   *
   * @function
   * @api
   * @param {Number} opacity 0 to 1, where 0 is fully transparent and 1 opaque
   */
  setOpacity(opacity) {
    this.getImpl().setOpacity(opacity);
  }

  /**
   * This function refreshes the state of this
   * layer
   *
   * @function
   * @api
   * @export
   */
  refresh() {
    // checks if the implementation can manage this method
    if (!isUndefined(this.getImpl().refresh) && isFunction(this.getImpl().refresh)) {
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
    this.name = generateRandom('layer_', '_'.concat(this.type));
  }
}

/**
 * Image PNG for default legend
 * @const
 * @type {string}
 * @public
 * @api
 */
LayerBase.LEGEND_DEFAULT = '/img/legend-default.png';

/**
 * Image PNG for error legend
 * @const
 * @type {string}
 * @public
 * @api
 */
LayerBase.LEGEND_ERROR = '/img/legend-error.png';

export default LayerBase;
