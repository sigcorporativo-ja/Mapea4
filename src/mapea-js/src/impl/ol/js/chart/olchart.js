goog.provide('M.impl.style.OLChart');

goog.require('goog.style');
goog.require('ol.style.Circle');
goog.require('ol.structs.IHasChecksum');

/**
 * @namespace M.impl.style.OLChart
 */
(function () {
  "use strict";

  /**
   * @classdesc
   * Set chart style for vector features
   *
   * @constructor
   * @param {olx.style.FontSymbolOptions=} Options.
   *	- type {pie|bar}
   *	- radius {number} chart radius
   *	- rotation {number}
   *	- snapToPixel {bool}
   *	- stroke {ol.style.Stroke} stroke style
   *	- colors {String|Array<color>} predefined color set "classic","dark","pale","pastel","neon" / array of color string, default classic
   *	- offsetX {number}
   *	- offsetY {number}
   *	- animation {number} step in an animation sequence [0,1]
   * @extends {ol.style.RegularShape}
   * @implements {ol.structs.IHasChecksum}
   * @api
   */
  M.impl.style.OLChart = function(options = {}) {

    let strokeWidth = !M.utils.isNullOrEmpty(options.stroke) ? options.stroke.getWidth() : 0;

    // super call
    ol.style.RegularShape.call(this, {
      radius: (typeof options.radius === 'number' ? options.radius : 0) + strokeWidth,
      fill: new ol.style.Fill({color: [0, 0, 0]}),
      rotation: (typeof options.rotation === 'number' ? options.rotation : 0),
      snapToPixel: (typeof options.snapToPixel === 'boolean' ? options.snapToPixel : false)
    });

    if (options.scale) {
      this.setScale(options.scale);
    }

    this.variables_ = options.variables || [];

    /**
     * @private
     */
    this.stroke_ = options.stroke || null;

    /**
     * @private
     */
    this.radius_ = options.radius || 0;

    /**
     * @private
     */
    this.donutRatio_ = options.donutRatio || 0;

    /**
     * @private
     */
    this.type_ = options.type || null;

    /**
     * @private
     */
    this.offset_ = [
      options.offsetX ? options.offsetX : 0,
      options.offsetY ? options.offsetY : 0,
    ];

    /**
     * @private
     */
    this.animation_ = {
      animate: typeof options.animation === 'number',
      step: (typeof options.animation === 'number') ? options.animation : M.style.Chart.DEFAULT.animationStep
    };

    /**
     * @private
     */
    this.data_ = options.data || null;

    /**
     * @private
     */
    this.colors_ = options.scheme instanceof Array ? options.scheme : [];

    /**
     * @private
     */
    this.fill3DColor_ = options.fill3DColor || '#000';

    // call to render
    this.renderChart_();
  };
  ol.inherits(M.impl.style.OLChart, ol.style.RegularShape);

  /**
   * @public
   * @function
   * @api stable
   */
  M.impl.style.OLChart.prototype.clone = function() {
    let newInstance = new M.impl.style.OLChart({
      type: this.type_,
      radius: this.radius_,
      colors: this.colors_,
  		rotation: this.getRotation(),
  		scale: this.getScale(),
  		data: this.getData(),
  		snapToPixel: this.getSnapToPixel(),
  		stroke: this.stroke_,
  		scheme: this.colors_,
  		offsetX: this.offset_[0],
  		offsetY: this.offset_[1],
  		animation: this.animation_,
      fill3DColor: this.fill3DColor_
    });
    newInstance.setScale(this.getScale());
    newInstance.setOpacity(this.getOpacity());
    return newInstance;
  };

  /**
   *
   */
  Object.defineProperty(M.impl.style.OLChart.prototype, 'data', {
    get: function() {
      return this.data_;
    },
    set: function(data) {
      this.data_ = data;
      this.renderChart_();
    }
  });

  /**
   *
   */
  Object.defineProperty(M.impl.style.OLChart.prototype, 'radius', {
    get: function() {
      return this.radius_;
    },
    set: function(radius) {
      this.radius_ = radius;
      this.renderChart_();
    }
  });

  /**
   * @public
   * @function
   * @api stable
   */
  M.impl.style.OLChart.prototype.setRadius = function(radius, ratio) {
    this.donutRatio_ = ratio || this.donutRatio_;
    this.radius = radius;
  };

  /**
   * @public
   * @function
   * @api stable
   */
  M.impl.style.OLChart.prototype.setAnimation = function(step) {
    if (step === false ) {
      if (this.animation_.animate == false) {
        return;
      }
      this.animation_.animate = false;
    } else {
      if (this.animation_.step == step) {
        return;
      }
      this.animation_.animate = true;
      this.animation_.step = step;
    }
    this.renderChart_();
  };

  /**
   * @inheritDoc
   */
  M.impl.style.OLChart.prototype.getChecksum = function() {
    let strokeChecksum = (this.stroke_ !== null) ? this.stroke_.getChecksum() : '-';
    let recalculate = (this.checksums_ === null) ||
      (strokeChecksum != this.checksums_[1]) ||
      (fillChecksum != this.checksums_[2]) ||
      (this.radius_ != this.checksums_[3]) ||
      (this.data_.join('|') != this.checksums_[4]);

    if (recalculate) {
      let checksum = 'c' + strokeChecksum + fillChecksum
        + ((this.radius_ !== void 0) ? this.radius_.toString() : '-')
        + this.data_.join('|');
      this.checksums_ = [checksum, strokeChecksum, fillChecksum, this.radius_, this.data_.join('|')];
    }
    return this.checksums_[0];
  };

  /**
   * Renders the chart
   *
   * @function
   * @private
   * @api stable
   */
  M.impl.style.OLChart.prototype.renderChart_ = function(atlasManager) {
    let strokeStyle;
    let strokeWidth = 0;

    if (this.stroke_) {
      strokeStyle = ol.color.asString(this.stroke_.getColor());
      strokeWidth = this.stroke_.getWidth();
    }

    let canvas = this.getImage();
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineJoin = 'round';

    let sum = 0;
    if (!M.utils.isNullOrEmpty(this.data_) && this.data_.length > 0) {
      sum = this.data_.reduce((tot, curr) => tot + curr);
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(0, 0);

    let step = this.animation_.animate ? this.animation_.step : 1;
    let center;
    switch (this.type_) {
      case M.style.chart.types.DONUT:
      case M.style.chart.types.PIE_3D:
      case M.style.chart.types.PIE:
        let angle;
        let angle0 = Math.PI * (step - 1.5);
        center = canvas.width / 2;
        if (strokeStyle) {
          context.strokeStyle = strokeStyle;
          context.lineWidth = strokeWidth;
        }
        context.save();
        if (this.type_ === M.style.chart.types.PIE_3D) {
          context.translate(0, center * 0.3);
          context.scale(1, 0.7);
          context.beginPath();
          context.fillStyle = this.fill3DColor_;
          context.arc(center, center * 1.4, this.radius_ * step, 0, 2 * Math.PI);
          context.fill();
          if (strokeStyle) {
            context.stroke();
          }
        } else if (this.type_ ===  M.style.chart.types.DONUT) {
          context.save();
          context.beginPath();
          context.rect(0, 0, 2 * center, 2 * center);
          context.arc(center, center, this.radius_ * step * this.donutRatio_, 0, 2 * Math.PI);
          context.clip('evenodd');
        }
        this.data_.forEach((data, i) => {
          context.beginPath();
          context.moveTo(center, center);
          context.fillStyle = this.colors_[i % this.colors_.length];
          angle = angle0 + 2 * Math.PI * data / sum * step;
          context.arc(center, center, this.radius_ * step, angle0, angle);
          context.closePath();
          context.fill();
          if (strokeStyle) {
            context.stroke();
          }
          angle0 = angle;
        });
        if (this.type_ === M.style.chart.types.DONUT) {
          context.restore();
          context.beginPath();
          context.strokeStyle = strokeStyle;
          context.lineWidth = strokeWidth;
          context.arc(center, center, this.radius_ * step * this.donutRatio_, Math.PI * (step - 1.5), angle0);
          if (strokeStyle) {
            context.stroke();
          }
        }
        context.restore();
        break;
      case M.style.chart.types.BAR:
      default:
        let max = Math.max.apply(null, this.data_) || 0;
        let start = Math.min(5,2 * this.radius_/this.data_.length);
        let border = canvas.width - (strokeWidth || 0);
        let x;
        center = canvas.width / 2;
        let x0 = center - this.data_.length * start / 2;
        if (strokeStyle) {
          context.strokeStyle = strokeStyle;
          context.lineWidth = strokeWidth;
        }
        this.data_.forEach((data, i) => {
          context.beginPath();
          context.fillStyle = this.colors_[i % this.colors_.length];
          x = x0 + start;
          let height = this.data_[i] / max * 2 * this.radius_ * step;
          context.rect(x0, border - height, start, height);
          context.closePath();
          context.fill();
          if (strokeStyle) {
            context.stroke();
          }
          x0 = x;
        });
        break;
    }
    let anchor = this.getAnchor();
    anchor[0] = center - this.offset_[0];
    anchor[1] = center - this.offset_[1];
  };

  /**
   * Draws in a vector context a "center point" as feature and applies it this chart style.
   * This draw only will be applied to geometries of type POLYGON or MULTI_POLYGON.
   * [_REV] -> revisar si linestring necesita tratamiento
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.OLChart.prototype.forceRender_ = function(feature, style, ctx) {
    if (feature.getGeometry() == null) {
      return;
    }
    //console.log('geometry', feature.getGeometry());

    let center = M.impl.utils.getCentroidCoordinate(feature.getGeometry());
    if (center != null) {
      let tmpFeature = new ol.Feature({
        geometry: new ol.geom.Point(center)
      });
      ctx.drawFeature(tmpFeature, style);
    }
  };

})();
