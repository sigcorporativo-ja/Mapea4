import Baseline from 'facade/js/style/Baseline';
import Utils from 'facade/js/util/Utils';
import Align from 'facade/js/style/Align';
import Simple from './Simple';
import Centroid from './Centroid';

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
    return (feature) => {
      let featureVariable = feature;
      if (!(featureVariable instanceof ol.Feature)) {
        featureVariable = this;
      }
      const style = new Centroid();
      if (!Utils.isNullOrEmpty(options.stroke)) {
        style.setStroke(new ol.style.Stroke({
          color: Simple.getValue(options.stroke.color, featureVariable),
          width: Simple.getValue(options.stroke.width, featureVariable),
          lineDash: Simple.getValue(options.stroke.linedash, featureVariable),
          lineDashOffset: Simple.getValue(options.stroke.linedashoffset, featureVariable),
          lineCap: Simple.getValue(options.stroke.linecap, featureVariable),
          lineJoin: Simple.getValue(options.stroke.linejoin, featureVariable),
          miterLimit: Simple.getValue(options.stroke.miterlimit, featureVariable),
        }));
      }
      if (!Utils.isNullOrEmpty(options.label)) {
        const textLabel = Simple.getValue(options.label.text, featureVariable);
        const align = Simple.getValue(options.label.align, featureVariable);
        const baseline = Simple.getValue(options.label.baseline, featureVariable);
        style.setText(new ol.style.Text({
          font: Simple.getValue(options.label.font, featureVariable),
          rotateWithView: Simple.getValue(options.label.rotate, featureVariable),
          scale: Simple.getValue(options.label.scale, featureVariable),
          offsetX: Simple.getValue(options.label.offset ?
            options.label.offset[0] : undefined, featureVariable),
          offsetY: Simple.getValue(options.label.ofsset ?
            options.label.offset[1] : undefined, featureVariable),
          fill: new ol.style.Fill({
            color: Simple.getValue(options.label.color || '#000000', featureVariable),
          }),
          textAlign: Object.values(Align).includes(align) ? align : 'center',
          textBaseline: Object.values(Baseline).includes(baseline) ? baseline : 'top',
          text: textLabel === undefined ? undefined : String(textLabel),
          rotation: Simple.getValue(options.label.rotation, featureVariable),
        }));
        if (!Utils.isNullOrEmpty(options.label.stroke)) {
          style.getText().setStroke(new ol.style.Stroke({
            color: Simple.getValue(options.label.stroke.color, featureVariable),
            width: Simple.getValue(options.label.stroke.width, featureVariable),
            lineCap: Simple.getValue(options.label.stroke.linecap, featureVariable),
            lineJoin: Simple.getValue(options.label.stroke.linejoin, featureVariable),
            lineDash: Simple.getValue(options.label.stroke.linedash, featureVariable),
            lineDashOffset: Simple.getValue(options.label.stroke.linedashoffset, featureVariable),
            miterLimit: Simple.getValue(options.label.stroke.miterlimit, featureVariable),
          }));
        }
      }
      if (!Utils.isNullOrEmpty(options.fill)) {
        const fillColorValue = Simple.getValue(options.fill.color, featureVariable);
        const fillOpacityValue = Simple.getValue(options.fill.opacity, featureVariable) || 1;
        let fill;
        if (!Utils.isNullOrEmpty(fillColorValue)) {
          fill = new ol.style.Fill({
            color: chroma(fillColorValue).alpha(fillOpacityValue).css(),
          });
        }
        if (!Utils.isNullOrEmpty(options.fill.pattern)) {
          let color = 'rgba(0,0,0,1)';
          if (!Utils.isNullOrEmpty(options.fill.pattern.color)) {
            const opacity = Simple.getValue(options.fill.pattern.opacity, featureVariable) || 1;
            color = chroma(options.fill.pattern.color).alpha(opacity).css();
          }
          style.setFill(new ol.style.FillPattern({
            pattern: (Simple.getValue(options.fill.pattern.name, featureVariable) || '')
              .toLowerCase(),
            color,

            size: Simple.getValue(options.fill.pattern.size, featureVariable),
            spacing: Simple.getValue(options.fill.pattern.spacing, featureVariable),
            image: (Simple.getValue(options.fill.pattern.name, featureVariable) === 'Image') ?
              new ol.style.Icon({
                src: Simple.getValue(options.fill.pattern.src, featureVariable),
              }) : undefined,
            angle: Simple.getValue(options.fill.pattern.rotation, featureVariable),
            scale: Simple.getValue(options.fill.pattern.scale, featureVariable),
            offset: Simple.getValue(options.fill.pattern.offset, featureVariable),
            fill,
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
    const canvasSize = Polygon.getCanvasSize();
    const vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize,
    });
    const applyStyle = this.olStyleFn_()[0];
    if (!Utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    const stroke = applyStyle.getStroke();
    if (!Utils.isNullOrEmpty(stroke) && !Utils.isNullOrEmpty(stroke.getWidth())) {
      if (stroke.getWidth() > Polygon.DEFAULT_WIDTH_POLYGON) {
        applyStyle.getStroke().setWidth(Polygon.DEFAULT_WIDTH_POLYGON);
      }
    }

    vectorContext.setStyle(applyStyle);
    Polygon.drawGeometryToCanvas(vectorContext);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  static drawGeometryToCanvas(vectorContext) {
    const canvasSize = Polygon.getCanvasSize();
    const maxW = Math.floor(canvasSize[0]);
    const maxH = Math.floor(canvasSize[1]);
    const minW = (canvasSize[0] - maxW);
    const minH = (canvasSize[1] - maxH);
    vectorContext.drawGeometry(new ol.geom.Polygon([[
      [minW + 3, minH + 3],
      [maxW - 3, minH + 3],
      [maxW - 3, maxH - 3],
      [minW + 3, maxH - 3],
      [minW + 3, minH + 3],
    ]]));
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  static getCanvasSize() {
    return [25, 15];
  }
}

Polygon.DEFAULT_WIDTH_POLYGON = 3;
