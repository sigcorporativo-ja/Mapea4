/**
 * @module M/impl/style/builder
 */
import chroma from 'chroma-js';
import { isNullOrEmpty, isFunction, isUndefined } from 'M/util/Utils';
import * as Align from 'M/style/Align';
import * as Baseline from 'M/style/Baseline';
import OLStyle from 'ol/style/Style';
import OLStyleFill from 'ol/style/Fill';
import OLStyleStroke from 'ol/style/Stroke';
import OLStyleText from 'ol/style/Text';
import OLStyleIcon from 'ol/style/Icon';
import Simple from './Simple';
import Path from './Path';
import PointIcon from '../point/Icon';
import PointFontSymbol from '../point/FontSymbol';
import OLStyleFillPattern from '../ext/OLStyleFillPattern';
import PointCircle from '../point/Circle';

/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getFill = (options, featureVariable, layer) => {
  let fill;
  if (!isNullOrEmpty(options.fill)) {
    const fillColorValue = Simple.getValue(options.fill.color, featureVariable, layer);
    let fillOpacityValue = Simple.getValue(options.fill.opacity, featureVariable, layer);
    if (!fillOpacityValue && fillOpacityValue !== 0) {
      fillOpacityValue = 1;
    }
    if (!isNullOrEmpty(fillColorValue)) {
      fill = new OLStyleFill({
        color: chroma(fillColorValue)
          .alpha(fillOpacityValue).css(),
      });
    }
  }
  return fill;
};

/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getStroke = (options, featureVariable, layer) => {
  let stroke;
  if (!isNullOrEmpty(options.stroke)) {
    const strokeColorValue =
      Simple.getValue(options.stroke.color, featureVariable, layer);
    if (!isNullOrEmpty(strokeColorValue)) {
      const { linedashoffset } = options.stroke;
      stroke = new OLStyleStroke({
        color: strokeColorValue,
        width: Simple.getValue(options.stroke.width, featureVariable, layer),
        lineDash: Simple.getValue(options.stroke.linedash, featureVariable, layer),
        lineDashOffset: Simple.getValue(linedashoffset, featureVariable, layer),
        lineCap: Simple.getValue(options.stroke.linecap, featureVariable, layer),
        lineJoin: Simple.getValue(options.stroke.linejoin, featureVariable, layer),
        miterLimit: Simple.getValue(options.stroke.miterlimit, featureVariable, layer),
      });
    }
  }
  return stroke;
};

/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getLabel = (options, featureVariable, layer) => {
  const DEFAULT_LABEL_COLOR = '#000';
  const DEFAULT_ALIGN = 'center';
  const DEFAULT_BASELINE = 'top';

  let labelText;
  if (options.label) {
    const textLabel = Simple.getValue(options.label.text, featureVariable, layer);
    const align = Simple.getValue(options.label.align, featureVariable, layer);
    const baseline = Simple.getValue(options.label.baseline, featureVariable, layer);
    labelText = new OLStyleText({
      font: Simple.getValue(options.label.font, featureVariable, layer),
      rotateWithView: Simple.getValue(options.label.rotate, featureVariable, layer),
      scale: Simple.getValue(options.label.scale, featureVariable, layer),
      offsetX: Simple.getValue(options.label.offset ?
        options.label.offset[0] : undefined, featureVariable, layer),
      offsetY: Simple.getValue(options.label.offset ?
        options.label.offset[1] : undefined, featureVariable, layer),
      fill: new OLStyleFill({
        color: Simple.getValue(options.label.color || DEFAULT_LABEL_COLOR, featureVariable, layer),
      }),
      textAlign: Object.values(Align).includes(align) ? align : DEFAULT_ALIGN,
      textBaseline: Object.values(Baseline).includes(baseline) ? baseline : DEFAULT_BASELINE,
      text: textLabel === undefined ? undefined : String(textLabel),
      rotation: Simple.getValue(options.label.rotation, featureVariable, layer),
    });
    if (!isNullOrEmpty(options.label.stroke)) {
      const { miterlimit, linedashoffset } = options.label.stroke;
      labelText.setStroke(new OLStyleStroke({
        color: Simple.getValue(options.label.stroke.color, featureVariable, layer),
        width: Simple.getValue(options.label.stroke.width, featureVariable, layer),
        lineCap: Simple.getValue(options.label.stroke.linecap, featureVariable, layer),
        lineJoin: Simple.getValue(options.label.stroke.linejoin, featureVariable, layer),
        lineDash: Simple.getValue(options.label.stroke.linedash, featureVariable, layer),
        lineDashOffset: Simple.getValue(linedashoffset, featureVariable, layer),
        miterLimit: Simple.getValue(miterlimit, featureVariable, layer),
      }));
    }
  }
  return labelText;
};

const iconCache = {};
/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getIconSrc = (options, featureVariable, layer) => {
  const anchor = Simple.getValue(options.icon.anchor, featureVariable, layer);
  const anchorXUnits = Simple.getValue(options.icon.anchorxunits, featureVariable, layer);
  const anchorYUnits = Simple.getValue(options.icon.anchoryunits, featureVariable, layer);
  const src = Simple.getValue(options.icon.src, featureVariable, layer);
  const opacity = Simple.getValue(options.icon.opacity, featureVariable, layer);
  const scale = Simple.getValue(options.icon.scale, featureVariable, layer);
  const rotation = Simple.getValue(options.icon.rotation, featureVariable, layer);
  const rotateWithView = Simple.getValue(options.icon.rotate, featureVariable, layer);
  const snapToPixel = Simple.getValue(options.icon.snaptopixel, featureVariable, layer);
  const offsetOrigin = Simple.getValue(options.icon.offsetorigin, featureVariable, layer);
  const offset = Simple.getValue(options.icon.offset, featureVariable, layer);
  const crossOrigin = Simple.getValue(options.icon.crossorigin, featureVariable, layer);
  const anchorOrigin = Simple.getValue(options.icon.anchororigin, featureVariable, layer);
  const size = Simple.getValue(options.icon.size, featureVariable, layer);

  const index = src + anchor + anchorXUnits + anchorYUnits + opacity +
    scale + rotation + rotateWithView + snapToPixel +
    offsetOrigin + offset + crossOrigin + anchorOrigin + anchorOrigin + size;
  let styleIcon = iconCache[index];

  if (!styleIcon) {
    styleIcon = new PointIcon({
      anchor: Simple.getValue(options.icon.anchor, featureVariable, layer),
      anchorXUnits: Simple.getValue(options.icon.anchorxunits, featureVariable, layer),
      anchorYUnits: Simple.getValue(options.icon.anchoryunits, featureVariable, layer),
      src: Simple.getValue(options.icon.src, featureVariable, layer),
      opacity: Simple.getValue(options.icon.opacity, featureVariable, layer),
      scale: Simple.getValue(options.icon.scale, featureVariable, layer),
      rotation: Simple.getValue(options.icon.rotation, featureVariable, layer),
      rotateWithView: Simple.getValue(options.icon.rotate, featureVariable, layer),
      snapToPixel: Simple.getValue(options.icon.snaptopixel, featureVariable, layer),
      offsetOrigin: Simple.getValue(options.icon.offsetorigin, featureVariable, layer),
      offset: Simple.getValue(options.icon.offset, featureVariable, layer),
      crossOrigin: Simple.getValue(options.icon.crossorigin, featureVariable, layer),
      anchorOrigin: Simple.getValue(options.icon.anchororigin, featureVariable, layer),
      size: Simple.getValue(options.icon.size, featureVariable, layer),
    });
    iconCache[index] = styleIcon;
  }
  return styleIcon;
};


/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getIconForm = (options, featureVariable, layer) => {
  const styleForm = new PointFontSymbol({
    form: isNullOrEmpty(Simple.getValue(options.icon.form, featureVariable, layer)) ? '' : Simple.getValue(options.icon.form, featureVariable, layer).toLowerCase(),
    gradient: Simple.getValue(options.icon.gradient, featureVariable, layer),
    glyph: Simple.getValue(options.icon.class, featureVariable, layer),
    fontSize: Simple.getValue(options.icon.fontsize, featureVariable, layer),
    radius: Simple.getValue(options.icon.radius, featureVariable, layer),
    rotation: Simple.getValue(options.icon.rotation, featureVariable, layer),
    rotateWithView: Simple.getValue(options.icon.rotate, featureVariable, layer),
    offsetX: Simple.getValue(options.icon.offset ?
      options.icon.offset[0] : undefined, featureVariable, layer),
    offsetY: Simple.getValue(options.icon.offset ?
      options.icon.offset[1] : undefined, featureVariable, layer),
    fill: new OLStyleFill({
      color: Simple.getValue(options.icon.fill !== undefined ? options.icon.fill : '#FFFFFF', featureVariable, layer),
    }),
    stroke: options.icon.color ? new OLStyleStroke({
      color: Simple.getValue(options.icon.color, featureVariable, layer),
      width: 1,
    }) : undefined,
    anchor: Simple.getValue(options.icon.anchor, featureVariable, layer),
    anchorXUnits: Simple.getValue(options.icon.anchorxunits, featureVariable, layer),
    anchorYUnits: Simple.getValue(options.icon.anchoryunits, featureVariable, layer),
    src: Simple.getValue(options.icon.src, featureVariable, layer),
    opacity: Simple.getValue(options.icon.opacity, featureVariable, layer),
    scale: Simple.getValue(options.icon.scale, featureVariable, layer),
    snapToPixel: Simple.getValue(options.icon.snaptopixel, featureVariable, layer),
    offsetOrigin: Simple.getValue(options.icon.offsetorigin, featureVariable, layer),
    offset: Simple.getValue(options.icon.offset, featureVariable, layer),
    crossOrigin: Simple.getValue(options.icon.crossorigin, featureVariable, layer),
    anchorOrigin: Simple.getValue(options.icon.anchororigin, featureVariable, layer),
    size: Simple.getValue(options.icon.size, featureVariable, layer),
  });
  return styleForm;
};

export const getFillPatern = (options, featureVariable, layer, fill) => {
  let color = 'rgba(0,0,0,1)';
  if (!isNullOrEmpty(options.fill.pattern.color)) {
    let opacity = Simple.getValue(options.fill.pattern.opacity, featureVariable, layer) || 1;
    if (!opacity && opacity !== 0) {
      opacity = 1;
    }
    color = chroma(options.fill.pattern.color).alpha(opacity).css();
  }
  const style = new OLStyleFillPattern({
    pattern: (Simple.getValue(options.fill.pattern.name, featureVariable, layer) || '')
      .toLowerCase(),
    color,

    size: Simple.getValue(options.fill.pattern.size, featureVariable, layer),
    spacing: Simple.getValue(options.fill.pattern.spacing, featureVariable, layer),
    image: (Simple.getValue(options.fill.pattern.name, featureVariable, layer) === 'IMAGE') ?
      new OLStyleIcon({
        src: Simple.getValue(options.fill.pattern.src, featureVariable, layer),
      }) : undefined,
    angle: Simple.getValue(options.fill.pattern.rotation, featureVariable, layer),
    scale: Simple.getValue(options.fill.pattern.scale, featureVariable, layer),
    offset: Simple.getValue(options.fill.pattern.offset, featureVariable, layer),
    fill,
  });
  return style;
};


export const getLineStroke = (options, featureVariable, layer) => {
  let lineStroke;
  if (!isNullOrEmpty(options.fill)) {
    const fillColorValue = Simple.getValue(options.fill.color, featureVariable, layer);
    let fillOpacityValue = Simple.getValue(options.fill.opacity, featureVariable, layer);
    if (!fillOpacityValue && fillOpacityValue !== 0) {
      fillOpacityValue = 1;
    }
    const widthValue = Simple.getValue(options.fill.width, featureVariable, layer);
    if (!isNullOrEmpty(fillColorValue)) {
      lineStroke = new OLStyleStroke({
        color: chroma(fillColorValue)
          .alpha(fillOpacityValue).css(),
        width: widthValue,
      });
    }
  }
  return lineStroke;
};


export const getLineText = (options, featureVariable, layer) => {
  const { label } = options;
  const LABEL_FILL_COLOR = '#000';

  let textPathStyle;
  if (!isNullOrEmpty(label)) {
    const textPathConfig = {
      text: Simple.getValue(label.text, featureVariable) === undefined ?
        undefined : String(Simple.getValue(label.text, featureVariable)),
      font: Simple.getValue(label.font, featureVariable),
      fill: new OLStyleFill({
        color: Simple.getValue(label.color || LABEL_FILL_COLOR, featureVariable),
      }),
      textBaseline: (Simple.getValue(label.baseline, featureVariable) || '').toLowerCase(),
      textAlign: Simple.getValue(label.align, featureVariable),
      scale: Simple.getValue(label.scale, featureVariable),
      rotateWithView: Simple.getValue(label.rotate, featureVariable) || false,
      textOverflow: Simple.getValue(label.textoverflow, featureVariable) || '',
      minWidth: Simple.getValue(label.minwidth, featureVariable) || 0,
      geometry: Simple.getValue(label.geometry, featureVariable),
      offsetX: Simple.getValue(options.label.offset ? options.label.offset[0] :
        undefined, featureVariable),
      offsetY: Simple.getValue(options.label.offset ? options.label.offset[1] :
        undefined, featureVariable),
    };
    textPathStyle = new Path(textPathConfig);
    if (!isNullOrEmpty(label.stroke)) {
      textPathStyle.setStroke(new OLStyleStroke({
        color: Simple.getValue(label.stroke.color, featureVariable),
        width: Simple.getValue(label.stroke.width, featureVariable),
        lineCap: Simple.getValue(label.stroke.linecap, featureVariable),
        lineJoin: Simple.getValue(label.stroke.linejoin, featureVariable),
        lineDash: Simple.getValue(label.stroke.linedash, featureVariable),
        lineDashOffset: Simple.getValue(label.stroke.linedashoffset, featureVariable),
        miterLimit: Simple.getValue(label.stroke.miterlimit, featureVariable),
      }));
    }
  }
  return textPathStyle;
};

/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getPointStyle = (options, featureVariable, layer) => {
  const optionsVar = options || {};
  const fill = getFill(optionsVar, featureVariable, layer);
  const stroke = getStroke(optionsVar, featureVariable, layer);
  const image = new PointCircle({
    fill,
    stroke,
    radius: Simple.getValue(optionsVar.radius, featureVariable, layer),
    snapToPixel: Simple.getValue(optionsVar.snapToPixel, featureVariable, layer),
  });

  const pointStyle = new OLStyle({
    image,
  });

  const iconStyle = new OLStyle();

  if (!isNullOrEmpty(optionsVar.icon)) {
    let icon;

    const src = Simple.getValue(optionsVar.icon.src, featureVariable, layer);
    if (!isNullOrEmpty(src)) {
      icon = getIconSrc(optionsVar, featureVariable, layer);
      iconStyle.setImage(icon);
    } else if (!isNullOrEmpty(optionsVar.icon.form)) {
      icon = getIconForm(optionsVar, featureVariable, layer);
      iconStyle.setImage(icon);
    }
  }

  const label = getLabel(optionsVar, featureVariable, layer);
  if (!isNullOrEmpty(optionsVar.label) && !isUndefined(label.getText())) {
    pointStyle.setText(label);
  }

  return [pointStyle, iconStyle];
};

/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getLineStyle = (options, featureVariable, layer) => {
  const optionsVar = options || {};
  const stroke = getStroke(optionsVar, featureVariable, layer);
  const fill = getLineStroke(optionsVar, featureVariable, layer);
  const label = getLineText(optionsVar, featureVariable, layer);

  const style = new OLStyle();
  const styleLineStroke = new OLStyle();
  if (!isNullOrEmpty(label)) {
    const applyPath = Simple.getValue(label.path, featureVariable);
    if (applyPath === true) {
      style.textPath = label;
      if (!isNullOrEmpty(label.smooth) && label.smooth === true &&
        isFunction(featureVariable.getGeometry)) {
        style.setGeometry(featureVariable.getGeometry().cspline());
      }
    } else {
      style.setText(label);
    }
  }

  style.setStroke(stroke);
  styleLineStroke.setStroke(fill);

  return [style, styleLineStroke];
};

/**
 *
 * @param {*} options
 * @param {*} featureVariable
 * @param {*} layer
 */
export const getPolygonStyle = (options, featureVariable, layer) => {
  const optionsVar = options || {};

  const style = new OLStyle();
  const stroke = getStroke(optionsVar, featureVariable, layer);
  let fill = getFill(optionsVar, featureVariable, layer);
  const label = getLabel(optionsVar, featureVariable, layer);
  if (optionsVar.fill && !isNullOrEmpty(optionsVar.fill.pattern)) {
    fill = getFillPatern(optionsVar, featureVariable, layer);
  }

  style.setFill(fill);
  style.setStroke(stroke);
  style.setText(label);

  return [style];
};
