import Feature from('./stylefeature.js');
import SChartVar from('../chart/variable.js');
import SChartSTypes from('../chart/types.js');
import Utils from('../utils/utils.js');
import ChartImpl from('../../../impl/js/style/stylechart.js');


/**
 * @namespace Chart
 */
export class Chart extends Feature {

  /**
   * @classdesc
   * Main constructor of the class. Creates a chart style
   * with parameters specified by the user for the implementation
   * provided by the user
   *
   * @constructor
   * @extends {M.style.Simple}
   * @param {Mx.ChartOptions} options.
   *  - type {string|Chart.types} the chart type
   *  - radius {number} the radius of the chart. If chart type is 'bar' type this field
   *            will limit the max bar height
   *  - offsetX {number} chart x axis offset
   *  - offsetY {number} chart y axis offset
   *  - stroke.
   *      - color {string} the color of the chart stroke
   *      - width {number} the width of the chart stroke
   *  - fill3DColor: {string} the fill color of the PIE_3D cylinder
   *  - scheme {string|Array<string>|Chart.schemes} the color set of the chart.If
   *            value is typeof 'string' you must declare this scheme into Chart.schemes
   *            If you provide less colors than data size the colors will be taken from MOD operator:
   *              mycolor = userColors[currentArrayIndex % userColors.length]
   *  - rotateWithView {bool} determine whether the symbolizer rotates with the map.
   *  - animation {bool} this field is currently ignored [NOT IMPLEMENTED YET]
   *  - variables {object|Chart.Variable|string|Array<string>|Array<Chart.Variable>} the chart variables
   *
   * @api stable
   */
  constructor(options = {}) {
    // calls the super constructor
    super(this, options, impl);

    let variables = options.variables || null;

    // vars parsing
    if (!Object.values(SChartSTypes).includes(options.type)) {
      options.type = Chart.DEFAULT.type;
    }
    if (!Utils.isNullOrEmpty(variables)) {
      if (variables instanceof Array) {
        options.variables = variables.filter(variable => variable != null).map(variable => this.formatVariable_(variable));
      } else if (typeof variables === 'string' || typeof variables === 'object') {
        options.variables = [this.formatVariable_(variables)];
      } else {
        options.variables = [];
      }
    }

    // scheme parsing
    // if scheme is null we will set the default theme
    if (Utils.isNullOrEmpty(options.scheme)) {
      options.scheme = Chart.DEFAULT.scheme;
      // if is a string we will check if its custom (take values from variables) or a existing theme
    } else if (typeof options.scheme === 'string') {
      // NOTICE THAT } else if (options.scheme instanceof String) { WONT BE TRUE
      if (options.scheme === Chart.schemes.Custom && options.variables.some(variable => variable.fillColor != null)) {
        options.scheme = options.variables.map((variable) => variable.fillColor ? variable.fillColor : '');
      } else {
        options.scheme = Chart.schemes[options.scheme] || Chart.DEFAULT.scheme;
      }
      // if is an array of string we will set it directly
    } else if (!(options.scheme instanceof Array && options.scheme.every(el => typeof el === 'string'))) {
      options.scheme = Chart.DEFAULT.scheme;
    }

    let impl = new ChartImpl(options);
  }

  /**
   * formats a chart variable to creates a new Chart.Variable
   *
   * @param {Chart.Variable|string|object} variableOb a chart variable
   * @private
   * @function
   * @api stable
   */
  formatVariable_(variableOb) {
    if (variableOb == null) {
      return null;
    }
    let constructorOptions = {};
    if (variableOb instanceof SChartVar) {
      return variableOb;
    } else if (typeof variableOb === 'string') {
      constructorOptions = {
        attribute: variableOb
      };
    } else {
      constructorOptions = variableOb;
    }
    return new SChartVar(constructorOptions);
  }

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api stable
   */
  updateCanvas() {
    if (Utils.isNullOrEmpty(this.impl()) || Utils.isNullOrEmpty(this.canvas_)) {
      return false;
    }
    this.impl().updateCanvas(this.canvas_);
  }

  /**
   * @inheritDoc
   */
  apply(layer) {
    this.layer_ = layer;
    layer.features().forEach(feature => feature.style = this.clone());
    this.updateCanvas();
  }

  /**
   * Default options for this style
   *
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Chart.DEFAULT = {
    shadow3dColor: '#369',
    type: Chart.types.PIE,
    scheme: Chart.schemes.Classic,
    radius: 20,
    donutRatio: 0.5,
    offsetX: 0,
    offsetY: 0,
    animationStep: 1
  };
  /**
   * TODO
   */


  Object.defineProperty(Chart.prototype, "ORDER", {
    value: 1
  });
}
