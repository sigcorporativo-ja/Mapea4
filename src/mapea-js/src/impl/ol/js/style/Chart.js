import { isNullOrEmpty } from 'facade/js/util/Utils';
import Align from 'facade/js/Align';
import FacadeChart from 'facade/js/style/Chart';
import OLFeature from 'ol/Feature';
import OLStyleStroke from 'ol/style/Stroke';
import OLGeomMultipolygon from 'ol/geom/MultiPolygon';
import OLStyleText from 'ol/style/Text';
import OLStyleFill from 'ol/style/Fill';
import OLStyle from 'ol/style/Style';
import OLStyleIcon from 'ol/style/Icon';
import Baseline from 'facade/js/style/Baseline';
import OLChart from '../chart/OLChart';
import StyleCentroid from './Centroid';
import Feature from './Feature';
import Simple from './Simple';

/**
 * @namespace Chart
 */
export default class Chart extends Feature {
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
  constructor(options = {}) {
    // merge default values
    Chart.extend_(options, FacadeChart.DEFAULT);

    super(options);
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
    if (isNullOrEmpty(canvas)) {
      return false;
    }
    let context = canvas.getContext('2d');
    this.drawGeometryToCanvas(context);
  }

  /**
   * @inheritDoc
   */
  drawGeometryToCanvas(context) {
    if (isNullOrEmpty(context) || isNullOrEmpty(context.canvas)) {
      return null;
    }

    const fixedProps = Chart.CANVAS_PROPS.fixedProps;
    let width = Chart.CANVAS_PROPS.width;

    context.canvas.setAttribute('width', width);
    context.width = width;

    let drawStackActions = []; // canvas fn draw stack

    //const props = Object.keys(Chart.CANVAS_PROPS.percentages).map(key => {
    let percentages = {};
    Object.keys(Chart.CANVAS_PROPS.percentages).forEach(key => percentages[key] = width * (Chart.CANVAS_PROPS.percentages[key] / 100));
    // initial x, y content padding
    let [x0, y0] = [percentages.left_right_content, fixedProps.top_content];

    const wrapText = (context, initialPosition, text, maxWidth, lineHeight) => {
      let words = text.split(' ');
      let line = '';
      let [x, y] = initialPosition;
      drawStackActions
        .push((buildCtx, fontSize, fontFamily, strokeColor, strokeWidth, textColor) => {
          buildCtx.font = `${fontSize}px ${fontFamily}`;
          buildCtx.strokeStyle = strokeColor;
          buildCtx.strokeWidth = strokeWidth;
          buildCtx.fillStyle = textColor;
        });

      words.forEach((word, i) => {
        let metrics = context.measureText(line + word + ' ');
        if (metrics.width > maxWidth && i > 0) {
          drawStackActions.push((buildCtx, line, x, y) => {
            buildCtx.strokeText(line, x, y);
            buildCtx.fillText(line, x, y);
          });
          line = word + ' ';
          y += lineHeight;
        } else {
          line = line + word + ' ';
        }
      });
      drawStackActions.push((buildCtx, line, x, y) => {
        buildCtx.strokeText(line, x, y);
        buildCtx.fillText(line, x, y);
      });
      return [x, y];
    };

    const drawVariable = (initialPosition, text, color) => {
      let [x, y] = initialPosition;
      y += fixedProps.item_top_margin;
      drawStackActions.push((buildCtx, strokeColor, borderWidth, color, x, y, rectSize) => {
        buildCtx.beginPath();
        buildCtx.strokeStyle = strokeColor;
        buildCtx.lineWidth = borderWidth;
        buildCtx.fillStyle = color;
        buildCtx.rect(x, y, rectSize, rectSize);
        buildCtx.closePath();
        buildCtx.stroke();
        buildCtx.fill();
      });

      x += percentages.item_side_margin + fixedProps.rect_size;
      y += (fixedProps.rect_size / 1.5);
      // y coord plus bottom padding
      let tmp_image_y = y + fixedProps.item_top_margin;
      let textPosition = wrapText(context, [x, y], text, percentages.max_text_width, fixedProps.text_line_height);
      return [textPosition[0], (textPosition[1] > tmp_image_y ? textPosition[1] : tmp_image_y)];
    };
    this.variables_.forEach((variable, i) => {
      let label = !isNullOrEmpty(variable.legend) ? variable.legend : variable.attribute;
      let color = !isNullOrEmpty(variable.fillColor) ? variable.fillColor : (this.colorsScheme_[i % this.colorsScheme_.length] || this.colorsScheme_[0]);
      [x0, y0] = drawVariable([x0, y0], label, color);
      x0 = percentages.left_right_content;
    });
    y0 += fixedProps.top_content;

    context.canvas.setAttribute('height', y0);

    context.save();
    drawStackActions.forEach(drawAction => drawAction());
    context.restore();
  }

  /**
   * @inheritDoc
   */
  updateFacadeOptions(options) {
    options.rotateWithView = false;

    this.olStyleFn_ = (feature, resolution) => {
      if (!(feature instanceof OLFeature)) {
        resolution = feature;
        feature = this;
      }
      const getValue = Simple.getValue;
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

      if (!isNullOrEmpty(options.stroke)) {
        styleOptions.stroke = new OLStyleStroke(options.stroke);
      }

      let styles = [new StyleCentroid({
        geometry: (olFeature) => {
          let geometry = olFeature.getGeometry();
          if (olFeature.getGeometry() instanceof OLGeomMultipolygon) {
            geometry = geometry.getPolygons()[0].getInteriorPoint();
          }
          return geometry;
        },
        image: new OLChart(styleOptions)
      })];

      /*****
        [WARN] Chart text style won't be rendered for multipolygon geom types
      *****/
      // let geomTypes = Object.keys(ol.geom.GeometryType).map(k => ol.geom.GeometryType[k]);
      // let validGeom = feature.getGeometry() != null && geomTypes.includes(feature.getGeometry().getType()) && feature.getGeometry().getType() !== ol.geom.GeometryType.MULTI_POLYGON;
      if ((options.variables.length === 1 || options.variables.length === data.length) && styleOptions.type !== M.style.chart.types.BAR) {
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
          if (isNullOrEmpty(textAlign)) {
            textAlign = label.textAlign || (angle < Math.PI / 2 ? 'left' : 'right');
          }
          let text = typeof label.text === 'function' ? label.text(dataValue, styleOptions.data, feature) : (`${getValue(label.text, feature)}` || '');
          text = styleOptions.type !== Chart.types.BAR && text === '0' ? '' : text;
          let font = getValue(label.font, feature);
          return new StyleCentroid({
            text: new OLStyleText({
              text: typeof text === 'string' ? `${text}` : '',
              offsetX: typeof label.offsetX === 'number' ? getValue(label.offsetX, feature) : (Math.cos(angle) * (radius + radiusIncrement) + styleOptions.offsetX || 0),
              offsetY: typeof label.offsetY === 'number' ? getValue(label.offsetY, feature) : (Math.sin(angle) * (radius + radiusIncrement) + styleOptions.offsetY || 0),
              textAlign: getValue(textAlign, feature),
              textBaseline: getValue(label.textBaseline, feature) || 'middle',
              stroke: label.stroke ? new OLStyleStroke({
                color: getValue(label.stroke.color, feature) || '#000',
                width: getValue(label.stroke.width, feature) || 1
              }) : undefined,
              font: /^([1-9])[0-9]*px ./.test(font) ? font : `12px ${font}`,
              scale: typeof label.scale === 'number' ? getValue(label.scale, feature) : undefined,
              fill: new OLStyleFill({
                color: getValue(label.fill, feature) || '#000'
              })
            })
          });
        })).filter(style => style != null);
      } else if (styleOptions.type === Chart.types.BAR) {
        let height = 0;
        let acumSum = null;
        styles = styles.concat(styleOptions.data.map((dataValue, i) => {
          let variable = styleOptions.variables.length === styleOptions.data.length ? styleOptions.variables[i] : styleOptions.variables[0];
          let label = variable.label || {};
          if (!variable.label) {
            return null;
          }
          const getValue = Simple.getValue;
          let text = typeof label.text === 'function' ? label.text(dataValue, styleOptions.data, feature) : (`${getValue(label.text, feature)}` || '');
          text = text === '0' ? '' : text;
          if (isNullOrEmpty(text)) {
            return null;
          }
          let font = getValue(label.font, feature);
          let sizeFont = 9;
          if (isNullOrEmpty(acumSum)) {
            acumSum = (styles[0].getImage().getImage().height / 2) - 6;
          } else {
            acumSum -= sizeFont + 6;
          }
          height = height + sizeFont + 6;
          return new StyleCentroid({
            text: new OLStyleText({
              text: typeof text === 'string' ? `${text}` : '',
              offsetY: acumSum + styleOptions.offsetY || 0,
              offsetX: -(styles[0].getImage().getImage().width / 2) - 1 + styleOptions.offsetX || 0,
              textBaseline: 'middle',
              rotateWithView: false,
              textAlign: 'center',
              stroke: label.stroke ? new OLStyleStroke({}) : undefined,
              font: `9px ${font}`,
              scale: typeof label.scale === 'number' ? getValue(label.scale, feature) : undefined,
              fill: new OLStyleFill({
                color: styleOptions.scheme[i % styleOptions.scheme.length]
              })
            })
          });
        })).filter(style => style != null);
        height = Math.max(height, 1);
        styles.push(new OLStyle({
          image: new OLStyleIcon(({
            anchor: [-(styles[0].getImage().getImage().width / 2) + 10 + styleOptions.offsetX, (styles[0].getImage().getImage().height / 2) + styleOptions.offsetY],
            anchorOrigin: 'bottom-right',
            offsetOrigin: 'bottom-left',
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            rotateWithView: false,
            src: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="' + styles[0].getImage().getImage().width / 2 + '" height="' + height + '"><rect width="' + styles[0].getImage().getImage().width / 2 + '" height="' + height + '" fill="rgba(255, 255, 255, 0.75)" stroke-width="0" stroke="rgba(0, 0, 0, 0.34)"/></svg>'),
            size: [styles[0].getImage().getImage().width / 2, height]
          }))
        }));
      }
      if (!isNullOrEmpty(options.label)) {
        let styleLabel = new OLStyle();
        let textLabel = getValue(options.label.text, feature);
        let align = getValue(options.label.align, feature);
        let baseline = getValue(options.label.baseline, feature);
        let labelText = new OLStyleText({
          font: getValue(options.label.font, feature),
          rotateWithView: getValue(options.label.rotate, feature),
          scale: getValue(options.label.scale, feature),
          offsetX: getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: getValue(options.label.offset ? options.label.offset[1] : undefined, feature),
          fill: new OLStyleFill({
            color: getValue(options.label.color || '#000000', feature)
          }),
          textAlign: Object.values(Align).includes(align) ? align : 'center',
          textBaseline: Object.values(Baseline).includes(baseline) ? baseline : 'top',
          text: textLabel === undefined ? undefined : String(textLabel),
          rotation: getValue(options.label.rotation, feature)
        });
        if (!isNullOrEmpty(options.label.stroke)) {
          labelText.setStroke(new OLStyleStroke({
            color: getValue(options.label.stroke.color, feature),
            width: getValue(options.label.stroke.width, feature),
            lineCap: getValue(options.label.stroke.linecap, feature),
            lineJoin: getValue(options.label.stroke.linejoin, feature),
            lineDash: getValue(options.label.stroke.linedash, feature),
            lineDashOffset: getValue(options.label.stroke.linedashoffset, feature),
            miterLimit: getValue(options.label.stroke.miterlimit, feature)
          }));
        }
        styleLabel.setText(labelText);
        styles.push(styleLabel);
      }
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
    let featureCtx = feature.getImpl().getOLFeature();
    featureCtx.setStyle(this.olStyleFn_);
  }

  /**
   * Converts a single object to extracted feature values object
   * @param {object} options unparsed options object
   * @param {OLFeature} feature the ol feature
   * @return {object} parsed options with paths replaced with feature values
   * @function
   * @private
   * @api stable
   */
  formatDataRecursively_(options, feature) {
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
  }

  /**
   * Object assign hook. Merges the array of source objects into target object.
   * @param {object} target the target ob
   * @param {object|Array<object>} sourceObs array of source obs
   * @return {object} merged target object
   * @function
   * @private
   * @api stable
   */
  static extend_(target, ...sourceObs) {
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
