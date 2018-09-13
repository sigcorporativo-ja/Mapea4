import { isUndefined } from 'M/util/Utils';
import Line from 'M/style/Line';
import TextPath from './Textpath';

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

const postRender = function postRender(e = null) {
  // add support for textpath
  if (isUndefined(window.CanvasRenderingContext2D.prototype.textPath)) {
    window.CanvasRenderingContext2D.prototype.textPath = TextPath.render;
  }

  // Prevent drawing at large resolution
  if (e.frameState.viewState.resolution > this.textPathMaxResolution_) return;

  const extent = e.frameState.extent;

  const ctx = e.context;
  ctx.save();
  ctx.scale(e.frameState.pixelRatio, e.frameState.pixelRatio);

  const sourceWithoutFeatures = this.getSource() != null &&
    this.getSource().getFeatures().length === 0;
  if (!sourceWithoutFeatures) {
    // gets features in extent
    this.getSource().getFeaturesInExtent(extent).forEach((feature) => {
      const selectedStyle = feature.getStyle() != null ? feature.getStyle() : this.getStyle();
      let styles = typeof selectedStyle === 'function' ? selectedStyle(feature, e.frameState.viewState.resolution) : selectedStyle;
      if (!(styles instanceof Array)) {
        styles = [styles];
      }
      styles.forEach((style) => {
        let geom = (style instanceof Line ? style.getOptions().geometry :
          style.getGeometry()) || feature.getGeometry();
        let coords;
        if (typeof geom === 'function') {
          geom = geom(feature);
        }
        switch (geom.getType()) {
          case 'MultiLineString':
            coords = geom.getLineString(0).getCoordinates();
            break;
          default:
            coords = geom.getCoordinates();
        }

        // add support for textpath
        const textStyle = (style instanceof Line) ? style.getOptions().text : style.textPath;
        if (textStyle != null && textStyle instanceof TextPath) {
          TextPath.draw(ctx, e.frameState.coordinateToPixelTransform, textStyle, coords);
        }
      });
    });
    ctx.restore();
  }
};

export default postRender;
