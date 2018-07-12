import Simple from "./Simple";
import Centroid from "./Centroid";
import Utils from "facade/js/util/Utils";
import Baseline from "facade/js/style/Baseline";
import Align from "facade/js/Align";

/**
 * TODO
 * @private
 * @type {M.style.Polygon}
 */

export default class Polygon extends Simple {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {Simple}
   * @api stable
   */
  constructor(options) {
    super(options);
    this.olStyleFn_ = this.updateFacadeOptions(options);
  }

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   */
  updateFacadeOptions(options) {
    return (feature, resolution) => {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let style = new Centroid();
      if (!Utils.isNullOrEmpty(options.stroke)) {
        style.setStroke(new ol.style.Stroke({
          color: Simple.getValue(options.stroke.color, feature),
          width: Simple.getValue(options.stroke.width, feature),
          lineDash: Simple.getValue(options.stroke.linedash, feature),
          lineDashOffset: Simple.getValue(options.stroke.linedashoffset, feature),
          lineCap: Simple.getValue(options.stroke.linecap, feature),
          lineJoin: Simple.getValue(options.stroke.linejoin, feature),
          miterLimit: Simple.getValue(options.stroke.miterlimit, feature)
        }));
      }
      if (!Utils.isNullOrEmpty(options.label)) {
        let textLabel = Simple.getValue(options.label.text, feature);
        let align = Simple.getValue(options.label.align, feature);
        let baseline = Simple.getValue(options.label.baseline, feature);
        style.setText(new ol.style.Text({
          font: Simple.getValue(options.label.font, feature),
          rotateWithView: Simple.getValue(options.label.rotate, feature),
          scale: Simple.getValue(options.label.scale, feature),
          offsetX: Simple.getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: Simple.getValue(options.label.ofsset ? options.label.offset[1] : undefined, feature),
          fill: new ol.style.Fill({
            color: Simple.getValue(options.label.color || '#000000', feature)
          }),
          textAlign: Object.values(Align).includes(align) ? align : 'center',
          textBaseline: Object.values(Baseline).includes(baseline) ? baseline : 'top',
          text: textLabel === undefined ? undefined : String(textLabel),
          rotation: Simple.getValue(options.label.rotation, feature)
        }));
        if (!Utils.isNullOrEmpty(options.label.stroke)) {
          style.getText().setStroke(new ol.style.Stroke({
            color: Simple.getValue(options.label.stroke.color, feature),
            width: Simple.getValue(options.label.stroke.width, feature),
            lineCap: Simple.getValue(options.label.stroke.linecap, feature),
            lineJoin: Simple.getValue(options.label.stroke.linejoin, feature),
            lineDash: Simple.getValue(options.label.stroke.linedash, feature),
            lineDashOffset: Simple.getValue(options.label.stroke.linedashoffset, feature),
            miterLimit: Simple.getValue(options.label.stroke.miterlimit, feature)
          }));
        }
      }
      if (!Utils.isNullOrEmpty(options.fill)) {
        let fillColorValue = Simple.getValue(options.fill.color, feature);
        let fillOpacityValue = Simple.getValue(options.fill.opacity, feature) || 1;
        let fill;
        if (!Utils.isNullOrEmpty(fillColorValue)) {
          fill = new ol.style.Fill({
            color: chroma(fillColorValue).alpha(fillOpacityValue).css()
          });
        }
        if (!Utils.isNullOrEmpty(options.fill.pattern)) {
          let color = "rgba(0,0,0,1)";
          if (!Utils.isNullOrEmpty(options.fill.pattern.color)) {
            let opacity = Simple.getValue(options.fill.pattern.opacity, feature) || 1;
            color = chroma(options.fill.pattern.color).alpha(opacity).css();
          }
          style.setFill(new ol.style.FillPattern({
            pattern: (Simple.getValue(options.fill.pattern.name, feature) || "").toLowerCase(),
            color: color,
            size: Simple.getValue(options.fill.pattern.size, feature),
            spacing: Simple.getValue(options.fill.pattern.spacing, feature),
            image: (Simple.getValue(options.fill.pattern.name, feature) == 'Image') ? new ol.style.Icon({
              src: Simple.getValue(options.fill.pattern.src, feature)
            }) : undefined,
            angle: Simple.getValue(options.fill.pattern.rotation, feature),
            scale: Simple.getValue(options.fill.pattern.scale, feature),
            offset: Simple.getValue(options.fill.pattern.offset, feature),
            fill: fill
          }));
        }
        else {
          style.setFill(fill);
        }
      }
      return [style];
    };
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
    let canvasSize = this.getCanvasSize();
    let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize
    });
    let applyStyle = this.olStyleFn_()[0];
    if (!Utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    let stroke = applyStyle.getStroke();
    if (!Utils.isNullOrEmpty(stroke) && !Utils.isNullOrEmpty(stroke.getWidth())) {
      if (stroke.getWidth() > Polygon.DEFAULT_WIDTH_POLYGON) {
        applyStyle.getStroke().setWidth(Polygon.DEFAULT_WIDTH_POLYGON);
      }
    }

    vectorContext.setStyle(applyStyle);
    this.drawGeometryToCanvas(vectorContext);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  drawGeometryToCanvas(vectorContext) {
    let canvasSize = this.getCanvasSize();
    let maxW = Math.floor(canvasSize[0]);
    let maxH = Math.floor(canvasSize[1]);
    let minW = (canvasSize[0] - maxW);
    let minH = (canvasSize[1] - maxH);
    vectorContext.drawGeometry(new ol.geom.Polygon([[
         [minW + 3, minH + 3],
          [maxW - 3, minH + 3],
          [maxW - 3, maxH - 3],
          [minW + 3, maxH - 3],
          [minW + 3, minH + 3]
      ]]));
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getCanvasSize() {
    return [25, 15];
  }

}
Polygon.DEFAULT_WIDTH_POLYGON = 3;
