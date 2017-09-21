goog.provide('M.style.Chart');

goog.require('M.style.Simple');
goog.require('M.style.chart');
goog.require('M.style.chart.Variable');

/**
 * @namespace M.style.Chart
 */
(function() {

  /**
   * @classdesc
   * Main constructor of the class. Creates a chart style
   * with parameters specified by the user for the implementation
   * provided by the user
   *
   * @constructor
   * @extends {M.style.Simple}
   * @param {object} options.
   *  - type {string|M.style.chart.types} the chart type
   *  - radius {number} the radius of the chart. If chart type is 'bar' type this field
   *            will limit the max bar height
   *  - offsetX {number} chart x axis offset
   *  - offsetY {number} chart y axis offset
   *  - stroke.
   *      - color {string} the color of the chart stroke
   *      - width {number} the width of the chart stroke
   *  - fill3DColor: {string} the fill color of the PIE_3D cylinder
   *  - scheme {string|Array<string>|M.style.chart.schemes} the color set of the chart.If
   *            value is typeof 'string' you must declare this scheme into M.style.chart.schemes
   *            If you provide less colors than data size the colors will be taken from MOD operator:
   *              mycolor = userColors[currentArrayIndex % userColors.length]
   *  - rotateWithView {bool} determine whether the symbolizer rotates with the map.
   *  - animation {bool} this field is currently ignored [NOT IMPLEMENTED YET]
   *  - variables {object|M.style.chart.Variable|string|Array<string>|Array<M.style.chart.Variable>} the chart variables
   *
   * @api stable
   */
  M.style.Chart = (function(options = {}) {

    let variables = options.variables || null;

    // vars parsing
    if (!M.utils.isNullOrEmpty(variables)) {
      if (variables instanceof Array) {
        options.variables = variables.filter(variable => variable != null).map(variable => this.formatVariable_(variable));
      } else if (typeof variables === 'string' || typeof variables === 'object') {
        options.variables = [this.formatVariable_(variables)];
      } else {
        console.warn('invalid variables detected', variables)
        options.variables = [];
      }
    }

    // scheme parsing
    // if scheme is null we will set the default theme
    if (M.utils.isNullOrEmpty(options.scheme)) {
      options.scheme = M.style.Chart.DEFAULT.scheme;
    // if is a string we will check if its custom (take values from variables) or a existing theme
    } else if (typeof options.scheme === 'string') {
    // NOTICE THAT } else if (options.scheme instanceof String) { WONT BE TRUE
      if (options.scheme === M.style.chart.schemes.Custom && options.variables.some(variable => variable.fillColor != null)) {
        options.scheme = options.variables.map((variable) => variable.fillColor ? variable.fillColor : '');
      } else {
        options.scheme = M.style.chart.schemes[options.scheme] || M.style.Chart.DEFAULT.scheme;
      }
    // if is an array of string we will set it directly
    } else if (!(options.scheme instanceof Array && options.scheme.every(el => typeof el === 'string'))) {
      options.scheme = M.style.Chart.DEFAULT.scheme;
    }

    let impl = new M.impl.style.Chart(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Chart, M.style.Simple);

  /**
   * formats a chart variable to creates a new M.style.chart.Variable
   *
   * @param {M.style.chart.Variable|string|object} variableOb a chart variable
   * @private
   * @function
   * @api stable
   */
  M.style.Chart.prototype.formatVariable_ = function(variableOb) {
    if (variableOb == null) {
      return null;
    }
    let constructorOptions = {};
    if (variableOb instanceof M.style.chart.Variable) {
      return variableOb;
    } else if (typeof variableOb === 'string') {
      constructorOptions = {
        attribute: variableOb
      };
    } else {
      constructorOptions = variableOb;
    }
    return new M.style.chart.Variable(constructorOptions);
  };

   /**
    * Default options for this style
    *
    * @const
    * @type {object}
    * @public
    * @api stable
    */
   M.style.Chart.DEFAULT = {
     shadow3dColor: '#369',
     type: M.style.chart.types.BAR,
     scheme: M.style.chart.schemes.Classic,
     radius: 20,
     donutRatio: 0.5,
     offsetX: 0,
     offsetY: 0,
     animationStep: 1
   };

})();
