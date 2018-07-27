export default class Measure extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Measure
   * control to provides measure tools
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(impl, template) {
    super(impl, Measure.NAME);

    /**
     * Template of the control
     * @private
     * @type {string}
     */

    this.template_ = template;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @returns {Promise} HTML template
   * @api stable
   */
  createView(map) {
    return M.template.compile(this.template_, {
      jsonp: true,
    });
  }

  /**
   * This function returns the HTML control button
   *
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api stable
   * @export
   */
  static getActivationButton(element) {
    return element.querySelector('button#m-measure-button');
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof Measure) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.getImpl().destroy();
    this.template_ = null;
    this.impl = null;
  }
}
/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Measure.NAME = 'measurebar';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Measure.POINTER_TOOLTIP_TEMPLATE = 'measure_pointer_tooltip.html';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Measure.MEASURE_TOOLTIP_TEMPLATE = 'measure_tooltip.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Measure.HELP_MESSAGE = 'Click para empezar a dibujar';
