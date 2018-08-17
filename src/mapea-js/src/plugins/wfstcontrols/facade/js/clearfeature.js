import ClearFeatureImpl from '../../impl/ol/js/clearfeature';

export default class ClearFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ClearFeature
   * control to clean deleted, created and modified unsaved features.
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(layer) {
    // implementation of this control
    const impl = new ClearFeatureImpl(layer);

    // calls the super constructor
    super(impl, ClearFeature.NAME);

    if (M.utils.isUndefined(ClearFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles ClearFeature');
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
    return M.template.compile(ClearFeature.TEMPLATE, {
      jsonp: true,
    });
  }

  /**
   * This function adds the click event to the button
   *
   * @public
   * @function
   * @param {HTMLElement} element - HTML control
   * @api stable
   * @export
   */
  manageActivation(element) {
    const activationBtn = element.querySelector('button#m-button-clearfeature');
    activationBtn.addEventListener('click', this.clear_.bind(this));
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
    const equals = (obj instanceof ClearFeature);
    return equals;
  }

  /**
   * This function clean deleted, created and modified unsaved features
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Event
   */
  clear_(evt) {
    evt.preventDefault();
    this.getImpl().clear();
  }

  /**
   * This function set layer for clear
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  setLayer(layer) {
    this.getImpl().setLayer(layer);
  }
}

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
ClearFeature.NAME = 'clearfeature';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
ClearFeature.TEMPLATE = 'clearfeature.html';
