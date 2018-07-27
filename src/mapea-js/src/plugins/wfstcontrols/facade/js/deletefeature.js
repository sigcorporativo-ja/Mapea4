import DeleteFeatureImpl from '../../impl/ol/js/deletefeature';

export default class DeleteFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a DeleteFeature
   * control to remove features map
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(layer) {
    // implementation of this control
    const impl = new DeleteFeatureImpl(layer);

    // calls the super constructor
    super(impl, DeleteFeature.NAME);

    this.name = DeleteFeature.NAME;

    if (M.utils.isUndefined(DeleteFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles DeleteFeature');
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
    return M.template.compile(DeleteFeature.TEMPLATE, {
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
    return element.querySelector('button#m-button-deletefeature');
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
    const equals = (obj instanceof DeleteFeature);
    return equals;
  }

  /**
   * This function set layer for delete features
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
DeleteFeature.NAME = 'deletefeature';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
DeleteFeature.TEMPLATE = 'deletefeature.html';
