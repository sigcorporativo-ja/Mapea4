/**
 * @module M/style/Chart
 */
import ChartImpl from 'impl/style/Chart';
import StyleFeature from './Feature';
import ChartVariable from '../chart/Variable';
import * as ChartTypes from '../chart/types';
import { isNullOrEmpty } from '../util/Utils';

/**
 * @classdesc
 * Main constructor of the class. Creates a chart style
 * with parameters specified by the user
 * @api
 */
class Chart extends StyleFeature {
  /**
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
   *            If you provide less colors than data size the colors will be taken
   *            from MOD operator:
   *              mycolor = userColors[currentArrayIndex % userColors.length]
   *  - rotateWithView {bool} determine whether the symbolizer rotates with the map.
   *  - animation {bool} this field is currently ignored [NOT IMPLEMENTED YET]
   *  - variables {object|ChartVariable|string|Array<string>|Array<ChartVariable>} chart variables
   *
   * @api
   */
  constructor(optsVar = {}) {
    const options = optsVar;
    const variables = options.variables || null;

    // vars parsing
    if (!Object.values(ChartTypes.types).includes(options.type)) {
      options.type = Chart.DEFAULT.type;
    }
    if (!isNullOrEmpty(variables)) {
      if (variables instanceof Array) {
        options.variables = variables
          .filter(variable => variable != null).map(variable => Chart.formatVariable(variable));
      } else if (typeof variables === 'string' || typeof variables === 'object') {
        options.variables = [Chart.formatVariable(variables)];
      } else {
        options.variables = [];
      }
    }

    // scheme parsing
    // if scheme is null we will set the default theme
    if (isNullOrEmpty(options.scheme)) {
      options.scheme = Chart.DEFAULT.scheme;
      // if is a string we will check if its custom (take values from variables) or a existing theme
    } else if (typeof options.scheme === 'string') {
      // NOTICE THAT } else if (options.scheme instanceof String) { WONT BE TRUE
      const someNotNull = options.variables.some(variable => variable.fillColor != null);
      if (options.scheme === ChartTypes.schemes.Custom && someNotNull) {
        options.scheme = options.variables
          .map(variable => (variable.fillColor ? variable.fillColor : ''));
      } else {
        options.scheme = ChartTypes.schemes[options.scheme] || Chart.DEFAULT.scheme;
      }
      // if is an array of string we will set it directly
    } else if (!(options.scheme instanceof Array && options.scheme.every(el => typeof el === 'string'))) {
      options.scheme = Chart.DEFAULT.scheme;
    }

    const impl = new ChartImpl(options);
    // calls the super constructor
    super(options, impl);
  }

  /**
   * formats a chart variable to creates a new Chart.Variable
   *
   * @param {Chart.Variable|string|object} variableOb a chart variable
   * @private
   * @function
   */
  static formatVariable(variableOb) {
    if (variableOb == null) {
      return null;
    }
    let constructorOptions = {};
    if (variableOb instanceof ChartVariable) {
      return variableOb;
    } else if (typeof variableOb === 'string') {
      constructorOptions = {
        attribute: variableOb,
      };
    } else {
      constructorOptions = variableOb;
    }
    return new ChartVariable(constructorOptions);
  }

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api
   */
  updateCanvas() {
    if (!(isNullOrEmpty(this.getImpl()) && isNullOrEmpty(this.canvas_))) {
      this.getImpl().updateCanvas(this.canvas_);
    }
  }

  /**
   * @inheritDoc
   */
  apply(layer) {
    this.layer_ = layer;
    layer.getFeatures().forEach(feature => feature.setStyle(this.clone()));
    this.updateCanvas();
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api
   */
  get ORDER() {
    return 1;
  }
}

/**
 * Default options for this style
 *
 * @const
 * @type {object}
 * @public
 * @api
 */
Chart.DEFAULT = {
  shadow3dColor: '#369',
  type: ChartTypes.types.PIE,
  scheme: ChartTypes.schemes.Classic,
  radius: 20,
  donutRatio: 0.5,
  offsetX: 0,
  offsetY: 0,
  animationStep: 1,
};

export default Chart;
