import SaveFeatureImpl from "../.../impl/ol/js/savefeature";

export default class SaveFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a SaveFeature
   * control save changes to features
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(layer) {
    // implementation of this control
    let impl = new SaveFeatureImpl(layer);
    // calls the super constructor
    super(impl, SaveFeature.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */

    this.name = SaveFeature.NAME;

    if (M.utils.isUndefined(SaveFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles SaveFeature');
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
    this.facadeMap_ = map;
    return M.Template.compile(SaveFeature.TEMPLATE, {
      'jsonp': true
    });
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
    let equals = (obj instanceof SaveFeature);
    return equals;
  }

  /**
   * This function adds the click event to the button
   *
   * @public
   * @function
   * @param {HTMLElement} html - HTML control
   * @api stable
   * @export
   */
  manageActivation(html) {
    let button = html.querySelector('button#m-button-savefeature');
    button.addEventListener("click", this.saveFeature_);
  }

  /**
   * This function saves changes
   *
   * @public
   * @function
   * @param {goog.events.BrowserEvent} evt - Event
   * @api stable
   */
  saveFeature_(evt) {
    evt.preventDefault();
    this.getImpl().saveFeature();
  }

  /**
   * This function set layer for save features
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
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SaveFeature.NAME = 'savefeature';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SaveFeature.TEMPLATE = 'savefeature.html';
