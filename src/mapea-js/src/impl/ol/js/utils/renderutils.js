goog.provide('M.impl.renderutils');

goog.require('goog.style');
goog.require('M.impl.textpath');

/**
 * @namespace M.impl.postrenderer
 */
(function() {

  /**
   * Post render event method.<br />
   * Handles additional renderings after default ol style render.<br />
   *
   * <b>NOTICE</b> that this method is binded to vector layer, so
   * the context used inside method will be the olLayer (this = olLayer)
   *
   * @public
   * @see https://github.com/Viglino/ol3-ext/blob/gh-pages/style/settextpathstyle.js#L138
   * @function
   * @param {Object} e received event with framestate
   * @api stable
   */
  M.impl.renderutils.postRender = function(e = null) {

    // add support for textpath
    if (M.utils.isUndefined(CanvasRenderingContext2D.prototype.textPath)) {
      CanvasRenderingContext2D.prototype.textPath = M.impl.textpath.render;
    }

    // Prevent drawing at large resolution
    if (e.frameState.viewState.resolution > this.textPathMaxResolution_) return;

    let extent = e.frameState.extent;

    let ctx = e.context;
    ctx.save();
    ctx.scale(e.frameState.pixelRatio, e.frameState.pixelRatio);

    // gets features in extent
    this.getSource().getFeaturesInExtent(extent).forEach((feature) => {
      let selectedStyle = feature.getStyle() != null ? feature.getStyle() : this.getStyle();
      let styles = typeof selectedStyle === 'function' ? selectedStyle(feature, e.frameState.viewState.resolution) : selectedStyle;
      if (!(styles instanceof Array)) {
        styles = [styles];
      }
      styles.forEach((style) => {
        let geom = (style instanceof M.style.Line ? style.options_.geometry : style.getGeometry()) || feature.getGeometry();
        let coords;
        switch (geom.getType()) {
          case 'MultiLineString':
            coords = geom.getLineString(0).getCoordinates();
            break;
          default:
            coords = geom.getCoordinates();
        }

        // add support for textpath
        let textStyle = (style instanceof M.style.Line) ? style.options_.text : style.textPath;
        if (textStyle != null && textStyle instanceof M.impl.style.TextPath) {
          M.impl.textpath.draw(ctx, textStyle, coords);
        }

        // add support for charts
        if (feature.getGeometry() != null && (style instanceof ol.style.Style && style.getImage() != null && style.getImage())) {
          let imageStyle = style.getImage();
          if (imageStyle instanceof M.impl.style.OLChart) {
            imageStyle.forceRender_(feature, style, e.vectorContext);
          }
        }
      });
    });

    ctx.restore();
  };


})();
