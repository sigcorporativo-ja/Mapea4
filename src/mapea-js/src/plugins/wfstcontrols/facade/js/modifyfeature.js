import ModifyFeatureImpl from "../.../impl/ol/js/modifyfeature";

export default class ModifyFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control to edit map features
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(layer) {
    // implementation of this control
    let impl = new ModifyFeatureImpl(layer);

    // calls the super constructor
    super(impl, ModifyFeature.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.name = ModifyFeature.NAME;
    this.modify = null;

    if (M.utils.isUndefined(ModifyFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles ModifyFeature');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  createView(map) {
    return M.Template.compile(ModifyFeature.TEMPLATE, {
      'jsonp': true
    });
  }

  /**
   * This function returns the HTML button
   *
   * @public
   * @function
   * @param {HTMLElement} element - HTML control
   * @return {HTMLElement} return HTML button
   * @api stable
   * @export
   */
  getActivationButton(element) {
    return element.querySelector('button#m-button-modifyfeature');
  }

  /**
   * This function checks if an object is equals to this control
   *
   * @function
   * @api stable
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   */
  equals(obj) {
    let equals = (obj instanceof ModifyFeature);
    return equals;
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  setLayer(layer) {
    this.getImpl().layer_ = layer;
  }
}

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
ModifyFeature.NAME = 'modifyfeature';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
ModifyFeature.TEMPLATE = 'modifyfeature.html';
