goog.provide('M.impl.style.PointIcon');

goog.require('goog.style');
goog.require('ol.style.Icon');

/**
 * @namespace M.impl.style.PointIcon
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
  M.impl.style.PointIcon = function(options = {}) {

    if (!options.anchor) {
      options.anchor = [0, 0];
    }

    if (!options.offset) {
      options.offset = [0, 0];
    }
    if (!options.size) {
      //options.size_ = [32, 32];
    }
    // super call
    ol.style.Icon.call(this, {
      anchor: options.anchor.slice(),
      anchorOrigin: options.anchorOrigin || [],
      anchorXUnits: options.anchorXUnits,
      anchorYUnits: options.anchorYUnits,
      crossOrigin: options.crossOrigin,
      color: (options.color && options.color.slice) ? options.color.slice() : options.color || undefined,
      src: options.src,
      offset: options.offset.slice(),
      offsetOrigin: options.offsetOrigin || [],
      size: options.size !== null ? options.size.slice() : undefined,
      opacity: options.opacity,
      scale: options.scale,
      snapToPixel: options.snapToPixel,
      rotation: options.rotation,
      rotateWithView: options.rotateWithView
    });

    // [REV_]
    this.forceGeometryRender_ = typeof options.forceGeometryRender === 'boolean' ? options.forceGeometryRender : false;

  };
  ol.inherits(M.impl.style.PointIcon, ol.style.Icon);

  /**
   * clones the chart
   * @public
   * @function
   * @api stable
   */
  M.impl.style.PointIcon.prototype.clone = function() {};

  /**
   * Chart radius setter & getter
   * setter will render the chart
   */
  Object.defineProperty(M.impl.style.PointIcon.prototype, 'radius', {
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
  M.impl.style.PointIcon.prototype.forceRender_ = function(feature, style, ctx) {
    if (feature.getGeometry() == null) {
      return;
    }
    if (this.iconImage_.imageState_ === ol.ImageState.LOADED) {
      let center = M.impl.utils.getCentroidCoordinate(feature.getGeometry());
      if (center != null) {
        let tmpFeature = new ol.Feature({
          geometry: new ol.geom.Point(center)
        });
        ctx.drawFeature(tmpFeature, style);
      }
    }
  };
})();
