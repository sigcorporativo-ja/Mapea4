goog.provide('M.impl.style.Chart');

goog.require('M.impl.style.Simple');

goog.require('M.impl.style.CentroidStyle');
goog.require('M.impl.style.OLChart');

/**
 * @namespace M.impl.style.Chart
 */
(function() {

  /**
   * @classdesc
   * Set chart style for vector features
   *
   * @constructor
   * @param {Mx.ChartOptions} options. (SAME AS M.style.Chart)
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

    /**
     * the style variables
     * @private
     * @type {Array<M.style.chart.Variable>}
     */
    this.variables_ = options.variables || [];

    /**
     * the colors scheme
     * @private
     * @type {Array<string>}
     */
    this.colorsScheme_ = options.scheme || [];

    // merge default values
    this.extend_(options, M.style.Chart.DEFAULT);

    goog.base(this, options);
  };
  goog.inherits(M.impl.style.Chart, M.impl.style.Simple);

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api stable
   */
  M.impl.style.Chart.prototype.updateCanvas = function(canvas) {
    if (M.utils.isNullOrEmpty(canvas)) {
      return false;
    }
    let context = canvas.getContext('2d');
    this.drawGeometryToCanvas(context);
  };

  /**
   * @inheritDoc
   */
  M.impl.style.Chart.prototype.drawGeometryToCanvas = function(context) {
    if (M.utils.isNullOrEmpty(context) || M.utils.isNullOrEmpty(context.canvas)) {
      return null;
    }

    const fixedProps = M.impl.style.Chart.CANVAS_PROPS.fixedProps;
    let width = M.impl.style.Chart.CANVAS_PROPS.width;

    context.canvas.setAttribute('width', width);
    context.width = width;

    let drawStackActions = []; // canvas fn draw stack

    //const props = Object.keys(M.impl.style.Chart.CANVAS_PROPS.percentages).map(key => {
    let percentages = {};
    Object.keys(M.impl.style.Chart.CANVAS_PROPS.percentages).forEach(key => percentages[key] = width * (M.impl.style.Chart.CANVAS_PROPS.percentages[key] / 100));
    // initial x, y content padding
    let [x0, y0] = [percentages.left_right_content, fixedProps.top_content];

    const wrapText = (context, initialPosition, text, maxWidth, lineHeight) => {
      let words = text.split(' ');
      let line = '';
      let [x, y] = initialPosition;
      drawStackActions.push(function(buildCtx, fontSize, fontFamily, strokeColor, strokeWidth, textColor) {
        buildCtx.font = `${fontSize}px ${fontFamily}`;
        buildCtx.strokeStyle = strokeColor;
        buildCtx.strokeWidth = strokeWidth;
        buildCtx.fillStyle = textColor;
      }.bind(this, context, fixedProps.font_size, fixedProps.font_family, fixedProps.text_stroke_color, fixedProps.text_stroke_width, fixedProps.text_color));

      words.forEach((word, i) => {
        let metrics = context.measureText(line + word + ' ');
        if (metrics.width > maxWidth && i > 0) {
          drawStackActions.push(function(buildCtx, line, x, y) {
            buildCtx.strokeText(line, x, y);
            buildCtx.fillText(line, x, y);
          }.bind(this, context, line, x, y));
          line = word + ' ';
          y += lineHeight;
        }
        else {
          line = line + word + ' ';
        }
      });
      drawStackActions.push(function(buildCtx, line, x, y) {
        buildCtx.strokeText(line, x, y);
        buildCtx.fillText(line, x, y);
      }.bind(this, context, line, x, y));
      return [x, y];
    };

    const drawVariable = (initialPosition, text, color) => {
      let [x, y] = initialPosition;
      y += fixedProps.item_top_margin;
      drawStackActions.push(function(buildCtx, strokeColor, borderWidth, color, x, y, rectSize) {
        buildCtx.beginPath();
        buildCtx.strokeStyle = strokeColor;
        buildCtx.lineWidth = borderWidth;
        buildCtx.fillStyle = color;
        buildCtx.rect(x, y, rectSize, rectSize);
        buildCtx.closePath();
        buildCtx.stroke();
        buildCtx.fill();
      }.bind(this, context, '#000', fixedProps.rect_border_width, color, x, y, fixedProps.rect_size));

      x += percentages.item_side_margin + fixedProps.rect_size;
      y += (fixedProps.rect_size / 1.5);
      // y coord plus bottom padding
      let tmp_image_y = y + fixedProps.item_top_margin;
      let textPosition = wrapText(context, [x, y], text, percentages.max_text_width, fixedProps.text_line_height);
      return [textPosition[0], (textPosition[1] > tmp_image_y ? textPosition[1] : tmp_image_y)];
    };
    this.variables_.forEach((variable, i) => {
      let label = !M.utils.isNullOrEmpty(variable.legend) ? variable.legend : variable.attribute;
      let color = !M.utils.isNullOrEmpty(variable.fillColor) ? variable.fillColor : (this.colorsScheme_[i % this.colorsScheme_.length] || this.colorsScheme_[0]);
      [x0, y0] = drawVariable([x0, y0], label, color);
      x0 = percentages.left_right_content;
    });
    y0 += fixedProps.top_content;

    context.canvas.setAttribute('height', y0);

    context.save();
    drawStackActions.forEach(drawAction => drawAction());
    context.restore();
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
      let styleOptions = this.formatDataRecursively_(options, feature);
      let data = [];
      //let variables = this.variables_.map
      this.variables_.forEach(variable => {
        let featureData = feature.get(variable.attribute);
        // TODO revisar
        featureData = parseFloat(featureData);
        data = data.concat(featureData instanceof Array ? featureData : [featureData]).filter(fData => fData != null);
      });

      if (data.length == 0) {
        throw new Error('cannot draw an empty data chart');
      }

      styleOptions.data = data;

      if (!M.utils.isNullOrEmpty(options.stroke)) {
        styleOptions.stroke = new ol.style.Stroke(options.stroke);
      }

      let styles = [new M.impl.style.CentroidStyle({
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
          const getValue = M.impl.style.Simple.getValue;
          let text = typeof label.text === 'function' ? label.text(dataValue, styleOptions.data, feature) : (`${getValue(label.text, feature)}` || '');
          text = styleOptions.type !== M.style.chart.types.BAR && text === '0' ? '' : text;
          let font = getValue(label.font, feature);
          return new M.impl.style.CentroidStyle({
            text: new ol.style.Text({
              text: typeof text === 'string' ? `${text}` : '',
              offsetX: typeof label.offsetX === 'number' ? getValue(label.offsetX, feature) : (Math.cos(angle) * (radius + radiusIncrement)),
              offsetY: typeof label.offsetY === 'number' ? getValue(label.offsetY, feature) : (Math.sin(angle) * (radius + radiusIncrement)),
              textAlign: getValue(textAlign, feature),
              textBaseline: getValue(label.textBaseline, feature) || 'middle',
              stroke: label.stroke ? new ol.style.Stroke({
                color: getValue(label.stroke.color, feature) || '#000',
                width: getValue(label.stroke.width, feature) || 1
              }) : undefined,
              font: /^([1-9])[0-9]*px ./.test(font) ? font : `12px ${font}`,
              scale: typeof label.scale === 'number' ? getValue(label.scale, feature) : undefined,
              fill: new ol.style.Fill({
                color: getValue(label.fill, feature) || '#000'
              })
            })
          });
        })).filter(style => style != null);
      }
      else if (styleOptions.type === M.style.chart.types.BAR) {
        let acumSum = null;
        styles = styles.concat(styleOptions.data.map((dataValue, i) => {
          let variable = styleOptions.variables.length === styleOptions.data.length ? styleOptions.variables[i] : styleOptions.variables[0];
          let label = variable.label || {};
          let radius = label.radius ? label.radius : styleOptions.radius;
          let radiusIncrement = typeof label.radiusIncrement === 'number' ? label.radiusIncrement : 3;
          if (!variable.label) {
            return null;
          }
          const getValue = M.impl.style.Simple.getValue;
          let text = typeof label.text === 'function' ? label.text(dataValue, styleOptions.data, feature) : (`${getValue(label.text, feature)}` || '');
          text = styleOptions.type !== M.style.chart.types.BAR && text === '0' ? '' : text;
          if (M.utils.isNullOrEmpty(text)) {
            return null;
          }
          //  radius = text.length * 12;
          if (M.utils.isNullOrEmpty(acumSum)) {
            // acumSum = styles[0].getImage().getImage().height;
            acumSum = 10;
          }
          else {
            acumSum -= 12 + 5;
          }
          let font = getValue(label.font, feature);
          return new M.impl.style.CentroidStyle({
            text: new ol.style.Text({
              text: typeof text === 'string' ? `${text}` : '',
              // offsetX: styles[0].getImage().getImage().width * -1 /*- radiusIncrement*/ ,
              // offsetY: acumSum,
              offsetX: styleOptions.offsetX + styles[0].getImage().getImage().width * -1 + radiusIncrement,
              offsetY: styleOptions.offsetY + acumSum,
              textAlign: 'left',
              textBaseline: 'top',
              stroke: label.stroke ? new ol.style.Stroke({
                // color: getValue(label.stroke.color, feature) || '#000',
                //color: variable.fillColor_,
                color: 'black',
                width: getValue(label.stroke.width, feature) || 1
              }) : undefined,
              //tener en cuenta que puede indicarse
              font: /^([1-9])[0-9]*px ./.test(font) ? font : `9px ${font}`,
              //font: `12px ${font}`,
              scale: typeof label.scale === 'number' ? getValue(label.scale, feature) : undefined,
              fill: new ol.style.Fill({
                //color: getValue(label.fill, feature) || 'black',
                color: variable.fillColor_
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
    featureCtx.setStyle(this.olStyleFn_.bind(this, featureCtx));
  };

  /**
   * Converts a single object to extracted feature values object
   * @param {object} options unparsed options object
   * @param {ol.Feature} feature the ol feature
   * @return {object} parsed options with paths replaced with feature values
   * @function
   * @private
   * @api stable
   */
  M.impl.style.Chart.prototype.formatDataRecursively_ = function(options, feature) {
    return Object.keys(options).reduce((tot, curr, i) => {
      let _ob = tot;
      const setVal = (ob, opts, key) => {
        ob[key] = typeof opts[key] === 'object' && opts[key] != null && !(opts[key] instanceof Array) ? this.formatDataRecursively_(opts[key], feature) : M.impl.style.Simple.getValue(opts[key], feature);
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
  };

  /**
   * Object assign hook. Merges the array of source objects into target object.
   * @param {object} target the target ob
   * @param {object|Array<object>} sourceObs array of source obs
   * @return {object} merged target object
   * @function
   * @private
   * @api stable
   */
  M.impl.style.Chart.prototype.extend_ = function(target, ...sourceObs) {
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
   * Max canvas radius
   * @const
   * @type {number}
   */
  M.impl.style.Chart.CANVAS_PROPS = {
    width: 200, // px
    percentages: {
      left_right_content: 5, // %
      item_side_margin: 5, // %
      max_text_width: 70, // %
    },
    fixedProps: {
      rect_border_width: 2,
      font_size: 10, //px
      font_family: 'sans-serif',
      text_stroke_color: '#fff',
      text_stroke_width: 1,
      text_color: '#000',
      top_content: 10, // px
      item_top_margin: 10, // px
      text_line_height: 15, // px
      rect_size: 15, // px
    }
  };


})();;
