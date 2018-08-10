/**
 * @module M/style/chart/Variable
 */

/**
 * @classdesc
 * Main constructor of the class. Creates a chart variable
 * @api
 */
class Variable {
  /**
   * @param {Mx.ChartVariableOptions} options.
   *  - attribute {string} the feature property name where data is stored
   *  - label {number}
   *    - text {string|Function} data label displayed. If this property is a
   *           function the args passed will be: currentVal, values, feature
   *    - stroke.
   *      - color {string} the color of the data label stroke
   *      - width {number} the width of the data label stroke
   *    - radiusIncrement {number} distance between text position origin and
   *                      chart radius
   *    - fill {string} the color of the data label
   *    - font {string} the font family of the data label
   *    - scale {number} the scale of the data label. We can't use a font size so
   *            canvas will rescales the text
   *  - fill {number} the color of the chart representation fill (if chart type = 'bar')
   *         this property sets the bar fill color
   *  - legend {string} the layerswitcher legend label
   *
   *  [WARN] Notice that label property only will be applied if the geometry is
   *  not of type 'multipolygon' and chart type is distinct of 'bar' type
   *
   * @constructor
   * @api
   */
  constructor(options = {}) {
    /**
     * Feature property name where data is stored
     * @private
     * @type {string}
     */
    this.attributeName_ = options.attribute || null;

    /**
     * Data label displayed options
     * @private
     * @type {object}
     */
    this.label_ = options.label || null;

    /**
     * Data chart color
     * @private
     * @type {string}
     */
    this.fillColor_ = options.fill || null;

    /**
     * Layerswitcher display name
     * @private
     * @type {string}
     */
    this.legend_ = options.legend || null;
  }

  /**
   * attributeName_ setter & getter declaration
   */
  get attribute() {
    return this.attributeName_;
  }

  set attribute(attribute) {
    this.attributeName_ = attribute;
  }

  /**
   * label_ setter & getter declaration
   */
  get label() {
    return this.label_;
  }

  set label(label) {
    this.label_ = label;
  }

  /**
   * fillColor_ setter & getter declaration
   */
  get fillColor() {
    return this.fillColor_;
  }

  set fillColor(fillColor) {
    this.fillColor_ = fillColor;
  }

  /**
   * legend_ setter & getter declaration
   */
  get legend() {
    return this.legend_;
  }

  set legend(legend) {
    this.legend_ = legend;
  }
}

export default Variable;
