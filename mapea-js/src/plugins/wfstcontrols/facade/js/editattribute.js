import EditAttributeImpl from '../../impl/ol/js/editattribute';
import editattributeHTML from '../../templates/editattribute';

export default class EditAttribute extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a EditAttribute
   * edit the attributes of the features
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(layer) {
    // implementation of this control
    const impl = new EditAttributeImpl(layer);

    // calls the super constructor
    super(impl, EditAttribute.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.name = EditAttribute.NAME;

    if (M.utils.isUndefined(EditAttributeImpl)) {
      M.exception('La implementación usada no puede crear controles EditAttribute');
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
    return M.template.compileSync(editattributeHTML, {
      jsonp: true,
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
    return element.querySelector('button#m-button-editattribute');
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
    const equals = (obj instanceof EditAttribute);
    return equals;
  }

  /**
   * This function set layer for edit attributes features
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
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
EditAttribute.NAME = 'editattribute';

/**
 * Title for the popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
export const POPUP_TITLE = 'Editattribute';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
EditAttribute.TEMPLATE = 'editattribute.html';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
export const TEMPLATE_POPUP = 'editattribute_popup.html';
