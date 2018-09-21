/**
 * @module M/impl/style/Chart
 */
import { isNullOrEmpty, isObject } from 'M/util/Utils';
import * as Align from 'M/style/Align';
import FacadeChart from 'M/style/Chart';
import OLFeature from 'ol/Feature';
import OLStyleStroke from 'ol/style/Stroke';
import OLGeomPoint from 'ol/geom/Point';
import OLStyleText from 'ol/style/Text';
import OLStyleFill from 'ol/style/Fill';
import OLStyle from 'ol/style/Style';
import OLStyleIcon from 'ol/style/Icon';
import * as Baseline from 'M/style/Baseline';
import OLChart from '../olchart/OLChart';
import StyleCentroid from './Centroid';
import Feature from './Feature';
import Simple from './Simple';
import Utils from '../util/Utils';

/**
 * Object assign hook. Merges the array of source objects into target object.
 * @param {object} target the target ob
 * @param {object|Array<object>} sourceObs array of source obs
 * @return {object} merged target object
 * @function
 * @private
 */
const extend = (targetVar, ...sourceObs) => {
  const target = targetVar;
  if (target == null) { // TypeError if undefined or null
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const to = Object(target);
  sourceObs.filter(source => source != null).forEach(source => Object.keys(source)
    .forEach((sourceKey) => {
      if (Object.prototype.hasOwnProperty.call(source, sourceKey) &&
        !Object.prototype.hasOwnProperty.call(target, sourceKey)) {
        target[sourceKey] = source[sourceKey];
      }
    }));
  return to;
};

/**
 * This function get the text chart data of a feature attribute.
 * @function
 */
const getTextData = (label, feature, styleOptions, dataValue) => {
  let text;
  if (typeof label.text === 'function') {
    text = label.text(dataValue, styleOptions.data, feature);
  } else {
    text = `${Simple.getValue(label.text, feature)}` || '';
  }
  text = text === '0' ? '' : text;
  return text;
};

/**
 * This function generates the bar chart with options
 * @function
 */
const generateTextBarChart = (stylesParam, styleOptions, feature) => {
  let height = 0;
  let acumSum = null;
  const variables = styleOptions.variables;
  const data = styleOptions.data;
  const styles = stylesParam.concat(styleOptions.data.map((dataValue, i) => {
    const variable = variables.length === data.length ? variables[i] : variables[0];
    const label = variable.label || {};
    if (!variable.label) {
      return null;
    }
    const text = getTextData(label, feature, styleOptions, dataValue);
    const font = Simple.getValue(label.font, feature);
    const sizeFont = 9;
    if (isNullOrEmpty(acumSum)) {
      acumSum = (stylesParam[0].getImage().getImage().height / 2) - 6;
    } else {
      acumSum -= sizeFont + 6;
    }
    height = height + sizeFont + 6;
    const styleImage = stylesParam[0].getImage().getImage();
    const offsetX = -(styleImage.width / 2) - (1 + styleOptions.offsetX) || 0;
    return new StyleCentroid({
      text: new OLStyleText({
        text: typeof text === 'string' ? `${text}` : '',
        offsetY: acumSum + styleOptions.offsetY || 0,
        offsetX,
        textBaseline: 'middle',
        rotateWithView: false,
        textAlign: 'center',
        stroke: label.stroke ? new OLStyleStroke({}) : undefined,
        font: `9px ${font}`,
        scale: typeof label.scale === 'number' ? Simple.getValue(label.scale, feature) : undefined,
        fill: new OLStyleFill({
          color: styleOptions.scheme[i % styleOptions.scheme.length],
        }),
      }),
    });
  }));
  const filteredStyles = styles.filter(style => style != null);
  height = Math.max(height, 1);
  const anchorX = -(stylesParam[0].getImage().getImage().width / 2) + 10 + styleOptions.offsetX;
  const anchorY = (stylesParam[0].getImage().getImage().height / 2) + styleOptions.offsetY;
  const backgroundText = new OLStyleIcon(({
    anchor: [anchorX, anchorY],
    anchorOrigin: 'bottom-right',
    offsetOrigin: 'bottom-left',
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    rotateWithView: false,
    src: `data:image/svg+xml;base64,${window.btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${stylesParam[0].getImage()
      .getImage().width / 2}" height="${height}"><rect width="${styles[0].getImage()
      .getImage().width / 2}" height="${height}" fill="rgba(255, 255, 255, 0.75)" stroke-width="0" stroke="rgba(0, 0, 0, 0.34)"/></svg>`)}`,
    size: [styles[0].getImage().getImage().width / 2, height],
  }));
  filteredStyles.push(new OLStyle({
    image: backgroundText,
  }));
  return filteredStyles;
};

/**
 * This function generates the circle chart with options
 * @function
 */
const generateTextCircleChart = (stylesParam, styleOptions, feature) => {
  let acumSum = 0;
  const sum = styleOptions.data.reduce((tot, curr) => tot + curr);
  const variables = styleOptions.variables;
  const data = styleOptions.data;
  const styles = stylesParam.concat(styleOptions.data.map((dataValue, i) => {
    const variable = variables.length === data.length ? variables[i] : variables[0];
    const label = variable.label || {};
    const radius = label.radius ? label.radius : styleOptions.radius;
    const angle = (((((2 * acumSum) + dataValue) / sum) * Math.PI) - (Math.PI / 2));
    acumSum += dataValue;
    if (!variable.label) {
      return null;
    }
    const radiusIncrement = typeof label.radiusIncrement === 'number' ? label.radiusIncrement : 3;
    let textAlign = typeof label.textAlign === 'function' ? label.textAlign(angle) : null;
    if (isNullOrEmpty(textAlign)) {
      textAlign = label.textAlign || (angle < Math.PI / 2 ? 'left' : 'right');
    }
    const text = getTextData(label, feature, styleOptions, dataValue);
    const font = Simple.getValue(label.font, feature);
    const olFill = new OLStyleFill({
      color: Simple.getValue(label.fill, feature) || '#000',
    });
    const olStroke = new OLStyleStroke({
      color: Simple.getValue(label.stroke.color, feature) || '#000',
      width: Simple.getValue(label.stroke.width, feature) || 1,
    });
    const arcPositionX = Math.cos(angle) * ((radius + radiusIncrement) + styleOptions.offsetX) || 0;
    const arcPositionY = Math.sin(angle) * ((radius + radiusIncrement) + styleOptions.offsetY) || 0;
    const olText = new OLStyleText({
      text: typeof text === 'string' ? `${text}` : '',
      offsetX: typeof label.offsetX === 'number' ? Simple.getValue(label.offsetX, feature) : arcPositionX,
      offsetY: typeof label.offsetY === 'number' ? Simple.getValue(label.offsetY, feature) : arcPositionY,
      textAlign: Simple.getValue(textAlign, feature),
      textBaseline: Simple.getValue(label.textBaseline, feature) || 'middle',
      stroke: label.stroke ? olStroke : undefined,
      font: /^([1-9])[0-9]*px ./.test(font) ? font : `12px ${font}`,
      scale: typeof label.scale === 'number' ? Simple.getValue(label.scale, feature) : undefined,
      fill: olFill,
    });
    return new StyleCentroid({
      text: olText,
    });
  }));
  const filteredStyles = styles.filter(style => style != null);
  return filteredStyles;
};

/**
 * This function add the style text to the array of styles
 * @function
 */
const addTextChart = (options, styles, feature) => {
  if (!isNullOrEmpty(options.label)) {
    const styleLabel = new OLStyle();
    const textLabel = Simple.getValue(options.label.text, feature);
    const align = Simple.getValue(options.label.align, feature);
    const baseline = Simple.getValue(options.label.baseline, feature);
    const offsetX = options.label.offset ? options.label.offset[0] : undefined;
    const offsetY = options.label.offset ? options.label.offset[1] : undefined;
    const fill = new OLStyleFill({
      color: Simple.getValue(options.label.color || '#000000', feature),
    });
    const labelText = new OLStyleText({
      font: Simple.getValue(options.label.font, feature),
      rotateWithView: Simple.getValue(options.label.rotate, feature),
      scale: Simple.getValue(options.label.scale, feature),
      offsetX: Simple.getValue(offsetX, feature),
      offsetY: Simple.getValue(offsetY, feature),
      fill,
      textAlign: Object.values(Align).includes(align) ? align : 'center',
      textBaseline: Object.values(Baseline).includes(baseline) ? baseline : 'top',
      text: textLabel === undefined ? undefined : String(textLabel),
      rotation: Simple.getValue(options.label.rotation, feature),
    });
    if (!isNullOrEmpty(options.label.stroke)) {
      labelText.setStroke(new OLStyleStroke({
        color: Simple.getValue(options.label.stroke.color, feature),
        width: Simple.getValue(options.label.stroke.width, feature),
        lineCap: Simple.getValue(options.label.stroke.linecap, feature),
        lineJoin: Simple.getValue(options.label.stroke.linejoin, feature),
        lineDash: Simple.getValue(options.label.stroke.linedash, feature),
        lineDashOffset: Simple.getValue(options.label.stroke.linedashoffset, feature),
        miterLimit: Simple.getValue(options.label.stroke.miterlimit, feature),
      }));
    }
    styleLabel.setText(labelText);
    styles.push(styleLabel);
  }
};

/**
 * @classdesc
 * Openlayers implementation of style chart
 * @api
 */
class Chart extends Feature {
  /**
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
  *            If you provide less colors than data size
   the colors will be taken from MOD operator:
  *              mycolor = userColors[currentArrayIndex % userColors.length]
  *  - rotateWithView {bool} determine whether the symbolizer rotates with the map.
  *  - animation {bool} this field is currently ignored [NOT IMPLEMENTED YET]
  *  - variables {object|M.style.chart.Variable|string|Array<string>
  |Array<M.style.chart.Variable>} the chart variables
  *
  * @implements {M.impl.style.Simple}
  * @api
  */
  constructor(options = {}) {
    // merge default values
    extend(options, FacadeChart.DEFAULT);
    super(options);

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
  }

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api stable
   */
  updateCanvas(canvas) {
    if (!isNullOrEmpty(canvas)) {
      const context = canvas.getContext('2d');
      this.drawGeometryToCanvas(context);
    }
  }

  /**
   * TODO [REV] Refactor
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {CanvasRenderingContext2D} contextVar - CanvasRenderingContext2D
   * @api stable
   */
  drawGeometryToCanvas(contextVar) {
    const context = contextVar;
    if (!isNullOrEmpty(context) && !isNullOrEmpty(context.canvas)) {
      const fixedProps = Chart.CANVAS_PROPS.fixedProps;
      const width = Chart.CANVAS_PROPS.width;
      context.canvas.setAttribute('width', width);
      context.width = width;
      const drawStackActions = []; // canvas fn draw stack
      const percentages = {};
      Object.keys(Chart.CANVAS_PROPS.percentages).forEach((key) => {
        percentages[key] = width * (Chart.CANVAS_PROPS.percentages[key] / 100);
      });
      // initial x, y content padding
      let [x0, y0] = [percentages.left_right_content, fixedProps.top_content];
      const wrapText = (contextParam, initialPosition, text, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        const x = initialPosition[0];
        let y = initialPosition[1];
        drawStackActions.push(((options) => {
          const buildCtx = options.context;
          buildCtx.font = `${options.fontSize}px ${options.fontFamily}`;
          buildCtx.strokeStyle = options.strokeColor;
          buildCtx.strokeWidth = options.strokeWidth;
          buildCtx.fillStyle = options.textColor;
        }).bind(this, {
          context,
          fontSize: fixedProps.font_size,
          fontFamily: fixedProps.font_family,
          strokeColor: fixedProps.text_stroke_color,
          strokeWidth: fixedProps.text_stroke_width,
          textColor: fixedProps.text_color,
        }));
        words.forEach((word, i) => {
          const metrics = context.measureText(`${line + word}`);
          if (metrics.width > maxWidth && i > 0) {
            drawStackActions.push(((buildCtx, lineVar, xVar, yVar) => {
              buildCtx.strokeText(lineVar, xVar, yVar);
              buildCtx.fillText(lineVar, xVar, yVar);
            }).bind(this, context, line, x, y));
            line = `${word} `;
            y += lineHeight;
          } else {
            line = `${line + word} `;
          }
        });
        drawStackActions.push(((buildCtx, lineVar, xVar, yVar) => {
          buildCtx.strokeText(lineVar, xVar, yVar);
          buildCtx.fillText(lineVar, xVar, yVar);
        }).bind(this, context, line, x, y));
        return [x, y];
      };
      const drawVariable = (initialPosition, text, color) => {
        let [x, y] = initialPosition;
        y += fixedProps.item_top_margin;
        drawStackActions.push(((options) => {
          const buildCtx = options.context;
          buildCtx.beginPath();
          buildCtx.strokeStyle = options.strokeColor;
          buildCtx.lineWidth = options.width;
          buildCtx.fillStyle = options.color;
          buildCtx.rect(options.x, options.y, options.rectSize, options.rectSize);
          buildCtx.closePath();
          buildCtx.stroke();
          buildCtx.fill();
        }).bind(this, {
          context,
          strokeColor: '#000',
          width: fixedProps.rect_border_width,
          color,
          x,
          y,
          rectSize: fixedProps.rect_size,
        }));
        x += percentages.item_side_margin + fixedProps.rect_size;
        y += (fixedProps.rect_size / 1.5);
        // y coord plus bottom padding
        const tmpImageY = y + fixedProps.item_top_margin;
        const textWidth = percentages.max_text_width;
        const textHeight = percentages.max_text_line_height;
        const textPosition = wrapText(context, [x, y], text, textWidth, textHeight);
        return [textPosition[0], (textPosition[1] > tmpImageY ? textPosition[1] : tmpImageY)];
      };
      this.variables_.forEach((variable, i) => {
        const label = !isNullOrEmpty(variable.legend) ? variable.legend : variable.attribute;
        const color = !isNullOrEmpty(variable.fillColor) ?
          variable.fillColor : (this.colorsScheme_[i % this.colorsScheme_.length] ||
            this.colorsScheme_[0]);
        [x0, y0] = drawVariable([x0, y0], label, color);
        x0 = percentages.left_right_content;
      });
      y0 += fixedProps.top_content;
      context.canvas.setAttribute('height', y0);
      context.save();
      drawStackActions.forEach(drawAction => drawAction());
      context.restore();
    }
  }

  /**
   * This function se options to ol style
   *
   * @private
   * @param {object} optionsVar - options to style
   * @function
   * @api stable
   */
  updateFacadeOptions(optionsVar) {
    const options = optionsVar;
    options.rotateWithView = false;

    this.olStyleFn_ = (featureVar, resolutionVar) => {
      let feature = featureVar;
      if (!(feature instanceof OLFeature)) {
        feature = this;
      }
      const styleOptions = this.formatDataRecursively_(options, feature);
      let data = [];
      // let variables = this.variables_.map
      this.variables_.forEach((variable) => {
        let featureData = feature.get(variable.attribute);
        // TODO revisar
        featureData = parseFloat(featureData);
        data = data.concat(featureData instanceof Array ?
          featureData : [featureData]).filter(fData => fData != null);
      });

      if (data.length === 0) {
        throw new Error('cannot draw an empty data chart');
      }

      styleOptions.data = data;

      if (!isNullOrEmpty(options.stroke)) {
        styleOptions.stroke = new OLStyleStroke(options.stroke);
      }

      let styles = [new StyleCentroid({
        geometry: (olFeature) => {
          const center = Utils.getCentroid(olFeature.getGeometry());
          const centroidGeometry = new OLGeomPoint(center);
          return centroidGeometry;
        },
        image: new OLChart(styleOptions),
      })];

      if (styleOptions.type !== 'bar') {
        if (options.variables.length === 1 || options.variables.length === data.length) {
          styles = styles.concat(generateTextCircleChart(styles, styleOptions, feature));
        }
      } else if (styleOptions.type === 'bar') {
        styles = styles.concat(generateTextBarChart(styles, styleOptions, feature));
      }
      addTextChart(styleOptions, styles, feature);
      return styles;
    };
  }

  /**
   * @inheritDoc
   */
  applyToLayer(layer) {
    // in this case, the style only must be applied to features, never to the layer
    layer.getFeatures().forEach(this.applyToFeature, this);
  }

  /**
   * @inheritDoc
   */
  applyToFeature(feature) {
    const featureCtx = feature.getImpl().getOLFeature();
    featureCtx.setStyle(this.olStyleFn_);
  }

  /**
   * Converts a single object to extracted feature values object
   * @param {object} options unparsed options object
   * @param {OLFeature} feature the ol feature
   * @return {object} parsed options with paths replaced with feature values
   * @function
   * @private
   */
  formatDataRecursively_(options, feature) {
    return Object.keys(options).reduce((tot, curr, i) => {
      let ob = tot;
      if (typeof tot !== 'object') {
        ob = {};
        if (typeof options[tot] !== 'object') {
          this.setVal(ob, options, tot, feature);
        }
      }
      this.setVal(ob, options, curr);
      return ob;
    });
  }

  /**
   * @function
   */
  setVal(ob, opts, key, feature) {
    const obParam = ob;
    obParam[key] = Simple.getValue(opts[key], feature);
    if (isObject(opts[key]) && !(opts[key] instanceof Array)) {
      obParam[key] = this.formatDataRecursively_(opts[key], feature);
    }
  }
}

/**
 * Max canvas radius
 * @const
 * @type {number}
 */
Chart.CANVAS_PROPS = {
  width: 200, // px
  percentages: {
    left_right_content: 5, // %
    item_side_margin: 5, // %
    max_text_width: 70, // %
  },
  fixedProps: {
    rect_border_width: 2,
    font_size: 10, // px
    font_family: 'sans-serif',
    text_stroke_color: '#fff',
    text_stroke_width: 1,
    text_color: '#000',
    top_content: 10, // px
    item_top_margin: 10, // px
    text_line_height: 15, // px
    rect_size: 15, // px
  },
};

export default Chart;
