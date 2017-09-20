goog.provide('M.style.chart.Variable');

/**
 * @namespace M.style.chart.Variable
 */
(function() {
    /**
     *
     */
    M.style.chart.Variable = function(options = {}) {

      /**
       * @private
       */
      this.attributeName_ = options.attribute || null;

      /**
       * @private
       */
      this.label_ = options.label || null;

      /**
       * @private
       */
      this.fillColor_ = options.fill || null;

      /**
       * @private
       */
      this.legend_ = options.legend || null;

    };

    /**
     *
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
     *
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
     *
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
     *
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
