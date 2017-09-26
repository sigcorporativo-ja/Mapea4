goog.provide('M.impl.style.PointFontSymbol');

goog.require('goog.style');
goog.require('ol.style.FontSymbol');

/**
 * @namespace M.impl.style.PointFontSymbol
 */
(function() {
  "use strict";

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
   *  - variables {object|M.style.chart.Variable|string|Array<string>|Array<M.style.chart.Variable>} the chart variables
   *  - donutRatio {number} the chart 'donut' type ratio
   *  - data {Array<number>} chart data
   *  - fill3DColor {string} the pie3d cylinder fill color
   * @extends {ol.style.RegularShape}
   * @implements {ol.structs.IHasChecksum}
   * @api
   */
  M.impl.style.PointFontSymbol = function(options = {}) {

    if (!options.anchor_) {
      options.anchor_ = [];
    }

    if (!options.offset_) {
      options.offset_ = [];
    }

    // super call
    ol.style.FontSymbol.call(this, {
      glyph: options.glyph,
      color: options.color_,
      fontSize: options.fontSize_,
      stroke: options.stroke_,
      fill: options.fill_,
      radius: options.radius_ + (options.stroke_ ? options.stroke_.getWidth() : 0),
      form: options.form_,
      gradient: options.gradient_,
      offsetX: options.offset_[0],
      offsetY: options.offset_[1],
      opacity: options.opacity,
      rotation: options.rotation,
      rotateWithView: options.rotateWithView
    });

    // [REV_]
    this.forceGeometryRender_ = typeof options.forceGeometryRender === 'boolean' ? options.forceGeometryRender : false;
    if (this.forceGeometryRender_) {
      this.renderPoint_();
    }
  };
  ol.inherits(M.impl.style.PointFontSymbol, ol.style.Icon);

  /**
   * clones the chart
   * @public
   * @function
   * @api stable
   */
  M.impl.style.PointFontSymbol.prototype.clone = function() {};

  /**
   * Chart radius setter & getter
   * setter will render the chart
   */
  Object.defineProperty(M.impl.style.PointFontSymbol.prototype, 'radius', {
    get: function() {
      return this.radius_;
    },
    set: function(radius) {
      this.radius_ = radius;
    }
  });

  /**
   * Draws in a vector context a "center point" as feature and applies it this chart style.
   * This draw only will be applied to geometries of type POLYGON or MULTI_POLYGON.
   * [_REV] -> revisar si linestring necesita tratamiento
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.PointFontSymbol.prototype.forceRender_ = function(feature, style, ctx) {
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
