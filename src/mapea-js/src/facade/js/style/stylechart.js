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
   * with parameters specified by the user
   * for the implementation
   * provided by the user
   *
   * @constructor
   * @extends {M.style.Simple}
   * @param {object} options parameters
   * @api stable
   */
  M.style.Chart = (function(options = {}) {

    let variables = options.variables || null;

    // vars parsing
    if (!M.utils.isNullOrEmpty(variables)) {
      if (variables instanceof Array) {
        options.variables = variables.filter(variable => variable != null).map(variable => this.formatVariable_(variable));
      }
      else if (typeof variables === 'string' || typeof variables === 'object') {
        options.variables = [this.formatVariable_(variables)];
      }
      else {
        options.variables = [];
      }
    }

    // scheme parsing
    // if scheme is null we will set the default theme
    if (M.utils.isNullOrEmpty(options.scheme)) {
      options.scheme = M.style.Chart.DEFAULT.scheme;
      // if is a string we will check if its custom (take values from variables) or a existing theme
    }
    else if (typeof options.scheme === 'string') {
      // NOTICE THAT } else if (options.scheme instanceof String) { WONT BE TRUE
      if (options.scheme === M.style.chart.schemes.Custom && options.variables.some(variable => variable.fillColor != null)) {
        options.scheme = options.variables.map((variable) => variable.fillColor ? variable.fillColor : '');
      }
      else {
        options.scheme = M.style.chart.schemes[options.scheme] || M.style.Chart.DEFAULT.scheme;
      }
      // if is an array of string we will set it directly
    }
    else if (!(options.scheme instanceof Array && options.scheme.every(el => typeof el === 'string'))) {
      options.scheme = M.style.Chart.DEFAULT.scheme;
    }

    let impl = new M.impl.style.Chart(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Chart, M.style.Simple);

  /**
   * @private
   */
  M.style.Chart.prototype.formatVariable_ = function(variableOb) {
    if (variableOb == null) {
      return null;
    }
    let constructorOptions = {};
    if (variableOb instanceof M.style.chart.Variable) {
      return variableOb;
    }
    else if (typeof variableOb === 'string') {
      constructorOptions = {
        attribute: variableOb
      };
    }
    else {
      constructorOptions = variableOb;
    }
    return new M.style.chart.Variable(constructorOptions);
  };

  /**
   * TODO
   */
  M.style.Chart.prototype.serialize = function() {
    // TODO
  };

  /**
   * Default options for this style
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
