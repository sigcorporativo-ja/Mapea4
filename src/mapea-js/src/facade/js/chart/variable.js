goog.provide('M.style.chart.Variable');

/**
 * @namespace M.style.chart.Variable
 */
(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a chart variable
   *
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
   * @api stable
   */
    M.style.chart.Variable = function(options = {}) {

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

    };

    /**
     * attributeName_ setter & getter declaration
     */
    Object.defineProperty(M.style.chart.Variable.prototype, 'attribute', {
      get: function() {
        return this.attributeName_;
      },
      set: function(attribute) {
        this.attributeName_ = attribute;
      }
    });

    /**
     * label_ setter & getter declaration
     */
    Object.defineProperty(M.style.chart.Variable.prototype, 'label', {
      get: function() {
        return this.label_;
      },
      set: function(label) {
        this.label_ = label;
      }
    });

    /**
     * fillColor_ setter & getter declaration
     */
    Object.defineProperty(M.style.chart.Variable.prototype, 'fillColor', {
      get: function() {
        return this.fillColor_;
      },
      set: function(fillColor) {
        this.fillColor_ = fillColor;
      }
    });

    /**
     * legend_ setter & getter declaration
     */
    Object.defineProperty(M.style.chart.Variable.prototype, 'legend', {
      get: function() {
        return this.legend_;
      },
      set: function(legend) {
        this.legend_ = legend;
      }
    });

})();
