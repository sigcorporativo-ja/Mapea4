goog.provide('M.impl.style.Chart');

goog.require('M.impl.style.Simple');
goog.require('M.impl.style.OLChart');

/**
 * @namespace M.impl.style.Chart
 */
(function() {

  /**
   * Converts a single object to extracted feature values object
   * @param {object} options unparsed options object
   * @param {ol.Feature} feature the ol feature
   * @return {object} parsed options with paths replaced with feature values
   * @function
   * @private
   * @api stable
   */
  const formatDataRecursively = (options, feature) => Object.keys(options).reduce((tot, curr, i) => {
    let _ob = tot;
    const setVal = (ob, opts, key) => {
      ob[key] = typeof opts[key] === 'object' && opts[key] != null && !(opts[key] instanceof Array) ? formatDataRecursively(opts[key], feature) : M.impl.style.Simple.getValue(opts[key], feature);
    };
    if (typeof tot !== 'object') {
      _ob = {};
      if (typeof options[tot] !== 'object') {
        setVal(_ob, options, tot);
      }
    }
    setVal(_ob, options, curr);
    return _ob;
  });

  /**
   * Object assign hook. Merges the array of source objects into target object.
   * @param {object} target the target ob
   * @param {object|Array<object>} sourceObs array of source obs
   * @return {object} merged target object
   * @function
   * @private
   * @api stable
   */
  const extend = (target, ...sourceObs) => {
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    let to = Object(target);
    sourceObs.filter(source => source != null).forEach(source => Object.keys(source).forEach(sourceKey => {
      if (Object.prototype.hasOwnProperty.call(source, sourceKey) && !Object.prototype.hasOwnProperty.call(target, sourceKey)) {
        target[sourceKey] = source[sourceKey];
      }
    }));
    return to;
  };

  /**
   * @classdesc
   * Set chart style for vector features
   *
   * @constructor
   * @param {object} options. (SAME AS M.style.Chart)
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
   * @implements {M.impl.style.Simple}
   * @api
   */
  M.impl.style.Chart = function(options = {}) {

    /**
     * the ol style function
     * @private
     */
    this.olStyleFn_ = null;

    // merge default values
    extend(options, M.style.Chart.DEFAULT);

    goog.base(this, options);
  };
  goog.inherits(M.impl.style.Chart, M.impl.style.Simple);

  M.impl.style.Chart.prototype.updateCanvas = function(canvas) {
    // TODO
  };

  /**
   * @inheritDoc
   */
  M.impl.style.Chart.prototype.updateFacadeOptions = function(options) {
    this.olStyleFn_ = (feature, resolution) => {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let styleOptions = formatDataRecursively(options, feature);
      let data = [];
      options.variables.forEach(variable => {
        let featureData = feature.get(variable.attribute);
        data = data.concat(featureData instanceof Array ? featureData : [featureData]).filter(fData => fData != null);
      });

      if (data.length == 0) {
        throw new Error('cannot draw an empty data chart');
      }

      styleOptions.data = data;

      if (!M.utils.isNullOrEmpty(options.stroke)) {
        styleOptions.stroke = new ol.style.Stroke(options.stroke);
      }

      let styles = [new ol.style.Style({
        image: new M.impl.style.OLChart(styleOptions)
      })];

      /*****
        [WARN] Chart text style won't be rendered for multipolygon geom types
      *****/
      let geomTypes = Object.keys(ol.geom.GeometryType).map(k => ol.geom.GeometryType[k]);
      let validGeom = feature.getGeometry() != null && geomTypes.includes(feature.getGeometry().getType()) && feature.getGeometry().getType() !== ol.geom.GeometryType.MULTI_POLYGON;
      if (validGeom && (options.variables.length === 1 || options.variables.length === data.length) && styleOptions.type !== M.style.chart.types.BAR) {
        let acumSum = 0;
        let sum = styleOptions.data.reduce((tot, curr) => tot + curr);
        styles = styles.concat(styleOptions.data.map((dataValue, i) => {
          let variable = styleOptions.variables.length === styleOptions.data.length ? styleOptions.variables[i] : styleOptions.variables[0];
          let label = variable.label || {};
          let radius = label.radius ? label.radius : styleOptions.radius;
          let angle = (2 * acumSum + dataValue) / sum * Math.PI - Math.PI / 2;
          acumSum += dataValue;
          if (!variable.label) {
            return null;
          }
          let radiusIncrement = typeof label.radiusIncrement === 'number' ? label.radiusIncrement : 3;
          let textAlign = typeof label.textAlign === 'function' ? label.textAlign(angle) : null;
          if (M.utils.isNullOrEmpty(textAlign)) {
            textAlign = label.textAlign || (angle < Math.PI / 2 ? 'left' : 'right');
          }
          let text = typeof label.text === 'function' ? label.text(dataValue, styleOptions.data, feature) : (label.text || '');
          return new ol.style.Style({
            text: new ol.style.Text({
              text: typeof text === 'string' ? text : '',
              offsetX: typeof label.offsetX === 'number' ? label.offsetX : (Math.cos(angle) * (radius + radiusIncrement)),
              offsetY: typeof label.offsetY === 'number' ? label.offsetY : (Math.sin(angle) * (radius + radiusIncrement)),
              textAlign: textAlign,
              textBaseline: label.textBaseline || 'middle',
              stroke: label.stroke ? new ol.style.Stroke(label.stroke) : undefined,
              font: label.font,
              scale: typeof label.scale === 'number' ? label.scale : undefined,
              fill: new ol.style.Fill({
                color: label.fill || '#000'
              })
            })
          });
        })).filter(style => style != null);
      }

      return styles;
    };
  };

  /**
   * @inheritDoc
   */
  M.impl.style.Chart.prototype.applyToLayer = function(layer) {
    // in this case, the style only must be applied to features, never to the layer
    layer.getFeatures().forEach(this.applyToFeature, this);
  };

  /**
   * @inheritDoc
   */
  M.impl.style.Chart.prototype.applyToFeature = function(feature) {
    let featureCtx = feature.getImpl().getOLFeature();
    featureCtx.setStyle(this.olStyleFn_.bind(featureCtx));
  };


})();
