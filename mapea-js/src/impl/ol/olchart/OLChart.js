import OLStyleRegularShape from 'ol/style/RegularShape';
import OLStyleFill from 'ol/style/Fill';
import { asString as colorAsString } from 'ol/color';
import Chart from 'M/style/Chart';
import * as chartTypes from 'M/chart/types';
import { isNullOrEmpty } from 'M/util/Utils';

export default class OLChart extends OLStyleRegularShape {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {olx.style.FontSymbolOptions=} Options.
   *  - type {pie3d|pie|bar|donut} the chart type
   *  - radius {number} chart radius
   *  - rotation {number} determine whether the symbolizer rotates with the map
   *  - snapToPixel {bool} determine whether the symbolizer should be snapped to a pixel.
   *  - stroke {ol.style.Stroke} stroke style
   *  - colors {string|Array<string>} array of colors as string
   *  - offsetX {number} chart x axis offset
   *  - offsetY {number} chart y axis offset
   *  - animation {number} step in an animation sequence [0,1]
   *  - variables {object|M.style.chart.Variable|string|Array<string>
   * |Array<M.style.chart.Variable>} the chart variables
   *  - donutRatio {number} the chart 'donut' type ratio
   *  - data {Array<number>} chart data
   *  - fill3DColor {string} the pie3d cylinder fill color
   * @extends {ol.style.RegularShape}
   */
  constructor(options = {}) {
    const strokeWidth = !isNullOrEmpty(options.stroke) ? options.stroke.getWidth() : 0;

    // super call
    super({
      radius: (typeof options.radius === 'number' ? options.radius : 0) + strokeWidth,
      fill: new OLStyleFill({
        color: [0, 0, 0],
      }),
      rotation: (typeof options.rotation === 'number' ? options.rotation : 0),
      snapToPixel: (typeof options.snapToPixel === 'boolean' ? options.snapToPixel : false),
    });

    if (options.scale) {
      this.setScale(options.scale);
    }

    /**
     * the chart variables
     * @private
     * @type {object|M.style.chart.Variable|string|Array<string>|Array<M.style.chart.Variable>}
     */
    this.variables_ = options.variables || [];

    /**
     * stroke style
     * @private
     * @type {ol.style.Stroke}
     */
    this.stroke_ = options.stroke || null;

    /**
     * chart radius
     * @private
     * @type {number}
     */
    this.radius_ = options.radius || 0;

    /**
     * chart 'donut' type ratio
     * @private
     * @type {number}
     */
    this.donutRatio_ = options.donutRatio || 0;

    /**
     * chart type
     * @private
     * @type {string}
     */
    this.type_ = options.type || null;

    /**
     * chart axis offsets
     * @private
     * @type {Array<number>}
     */
    this.offset_ = [
      options.offsetX ? options.offsetX : 0,
      options.offsetY ? options.offsetY : 0,
    ];

    /**
     * animation config
     * [WARN] NOT IMPLEMENTED YET
     * @private
     * @type {object}
     */
    this.animation_ = {
      animate: typeof options.animation === 'number',
      step: (typeof options.animation === 'number') ? options.animation : Chart.DEFAULT.animationStep,
    };

    /**
     * chart data
     * @private
     * @type {Array<number>}
     */
    this.data_ = options.data || null;

    /**
     * chart colors
     * @private
     * @type {Array<string>}
     */
    this.colors_ = options.scheme instanceof Array ? options.scheme : [];

    /**
     * pie3d type cilynder color
     * @private
     * @type {string}
     */
    this.fill3DColor_ = options.fill3DColor || '#000';

    /**
     * rotate with the view of map
     * @private
     * @type {bool}
     */
    this.rotateWithView_ = options.rotateWithView || false;

    // call to render and updated the ol.style.image canvas
    this.renderChart_();
  }

  /**
   * clones the chart
   * @public
   * @function
   */
  clone() {
    const newInstance = new OLChart({
      type: this.type_,
      radius: this.radius_,
      colors: this.colors_,
      rotation: this.getRotation(),
      scale: this.getScale(),
      // data: this.getData(),
      donutRatio: this.donutRatio_,
      data: this.data_,
      stroke: this.stroke_,
      scheme: this.colors_,
      offsetX: this.offset_[0],
      offsetY: this.offset_[1],
      animation: this.animation_,
      fill3DColor: this.fill3DColor_,
      rotateWithView: this.rotateWithView_,
    });
    newInstance.setScale(this.getScale());
    newInstance.setOpacity(this.getOpacity());
    return newInstance;
  }

  /**
   * Chart data getter & setter
   * setter will render the chart
   */
  get data() {
    return this.data_;
  }

  set data(data) {
    this.data_ = data;
    this.renderChart_();
  }

  /**
   * Chart radius setter & getter
   * setter will render the chart
   */
  get radius() {
    return this.radius_;
  }

  set radius(radius) {
    this.radius_ = radius;
    this.renderChart_();
  }

  /**
   * Radius and donut ratio type setter
   * @public
   * @function
   */
  setRadius(radius, ratio) {
    this.donutRatio_ = ratio || this.donutRatio_;
    this.radius = radius;
  }

  /**
   * sets the animation step
   * @public
   * @function
   */
  setAnimation(step) {
    if (step === false) {
      if (this.animation_.animate === false) {
        return;
      }
      this.animation_.animate = false;
    } else {
      if (this.animation_.step === step) {
        return;
      }
      this.animation_.animate = true;
      this.animation_.step = step;
    }
    this.renderChart_();
  }

  /**
   * @inheritDoc
   */
  getChecksum() {
    let fillChecksum;
    const strokeChecksum = (this.stroke_ !== null) ? this.stroke_.getChecksum() : '-';
    const recalculate = (this.checksums_ === null) ||
      (strokeChecksum !== this.checksums_[1]) ||
      (fillChecksum !== this.checksums_[2]) ||
      (this.radius_ !== this.checksums_[3]) ||
      (this.data_.join('|') !== this.checksums_[4]);

    if (recalculate) {
      const radiusCheck = this.radius_ ? this.radius_.toString() : '-';
      const checksum = `c${strokeChecksum}${fillChecksum}${radiusCheck}${this.data_.join('|')}`;
      this.checksums_ = [checksum, strokeChecksum, fillChecksum, this.radius_, this.data_.join('|')];
    }
    return this.checksums_[0];
  }

  /**
   * Renders the chart.
   * This method is a layer postcompose event callback
   *
   * @function
   * @private
   */
  renderChart_(atlasManager) {
    switch (this.type_) {
      case chartTypes.types.DONUT:
      case chartTypes.types.PIE_3D:
      case chartTypes.types.PIE:
        this.renderCircleChart();
        break;
      default:
        this.renderBarChart();
        break;
    }
  }

  /**
   * @function
   * This function draw the Bar chart
   */
  renderBarChart() {
    const canvas = this.getImage(1);
    const context = canvas.getContext('2d');
    let strokeStyle;
    let strokeWidth = 0;
    const step = this.animation_.animate ? this.animation_.step : 1;
    if (this.stroke_) {
      strokeStyle = colorAsString(this.stroke_.getColor());
      strokeWidth = this.stroke_.getWidth();
    }
    const max = Math.max.apply(null, this.data_) || 0;
    const start = Math.min(5, (2 * this.radius_) / this.data_.length);
    const border = canvas.width - (strokeWidth || 0);
    let x;
    const center = canvas.width / 2;
    let x0 = center - ((this.data_.length * start) / 2);
    if (strokeStyle) {
      context.strokeStyle = strokeStyle;
      context.lineWidth = strokeWidth;
    }
    this.data_.sort((num, numNext) => num - numNext).forEach((data, i) => {
      context.beginPath();
      context.fillStyle = this.colors_[i % this.colors_.length];
      x = x0 + start;
      const height = (data / max) * 2 * this.radius_ * step;
      context.rect(x0, border - height, start, height);
      context.closePath();
      context.fill();
      if (strokeStyle) {
        context.stroke();
      }
      x0 = x;
    });
    const anchor = this.getAnchor();
    anchor[0] = center - this.offset_[0];
    anchor[1] = center - this.offset_[1];
  }

  /**
   * This function draw the circle chart: pie | pie3d | donut
   * @function
   */
  renderCircleChart() {
    let strokeStyle;
    let strokeWidth = 0;

    if (this.stroke_) {
      strokeStyle = colorAsString(this.stroke_.getColor());
      strokeWidth = this.stroke_.getWidth();
    }

    const canvas = this.getImage(1);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineJoin = 'round';

    let sum = 0;
    if (!isNullOrEmpty(this.data_) && this.data_.length > 0) {
      sum = this.data_.reduce((tot, curr) => tot + curr);
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(0, 0);

    const step = this.animation_.animate ? this.animation_.step : 1;
    const angle0 = Math.PI * (step - 1.5);
    const center = canvas.width / 2;
    if (strokeStyle) {
      context.strokeStyle = strokeStyle;
      context.lineWidth = strokeWidth;
    }
    context.save();
    if (this.type_ === chartTypes.types.PIE_3D) {
      this.drawPie3D(context, angle0, center, step, strokeStyle, sum);
    } else if (this.type_ === chartTypes.types.DONUT) {
      this.drawDonut(context, angle0, center, step, strokeStyle, strokeWidth, sum);
    } else {
      this.drawPie(context, angle0, center, step, strokeStyle, sum);
    }
    context.restore();
    const anchor = this.getAnchor();
    anchor[0] = center - this.offset_[0];
    anchor[1] = center - this.offset_[1];
  }

  /**
   * This function draw the Donut chart
   * @function
   */
  drawDonut(contextParam, angle0Param, center, step, strokeStyle, strokeWidth, sum) {
    const context = contextParam;
    context.save();
    context.beginPath();
    context.rect(0, 0, 2 * center, 2 * center);
    context.arc(center, center, this.radius_ * step * this.donutRatio_, 0, 2 * Math.PI);
    context.clip('evenodd');
    const angle0 = this.drawPie(context, angle0Param, center, step, strokeStyle, sum);
    context.restore();
    context.beginPath();
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;
    const r = this.radius_;
    context.arc(center, center, r * step * this.donutRatio_, Math.PI * (step - 1.5), angle0);
    if (strokeStyle) {
      context.stroke();
    }
  }

  /**
   * This function draw the 3D-Pie chart
   * @function
   */
  drawPie3D(contextParam, angle0Param, center, step, strokeStyle, sum) {
    const context = contextParam;
    context.translate(0, center * 0.3);
    context.scale(1, 0.7);
    context.beginPath();
    context.fillStyle = this.fill3DColor_;
    context.arc(center, center * 1.4, this.radius_ * step, 0, 2 * Math.PI);
    context.fill();
    if (strokeStyle) {
      context.stroke();
    }
    this.drawPie(contextParam, angle0Param, center, step, strokeStyle, sum);
  }

  /**
   * @function
   * This function draw the Pie chart
   */
  drawPie(contextParam, angle0Param, center, step, strokeStyle, sum) {
    let angle;
    let angle0 = angle0Param;
    const context = contextParam;
    this.data_.forEach((data, i) => {
      context.beginPath();
      context.moveTo(center, center);
      context.fillStyle = this.colors_[i % this.colors_.length];
      angle = angle0 + ((2 * Math.PI * data) / (sum * step));
      context.arc(center, center, this.radius_ * step, angle0, angle);
      context.closePath();
      context.fill();
      if (strokeStyle) {
        context.stroke();
      }
      angle0 = angle;
    });
    return angle0;
  }
}
