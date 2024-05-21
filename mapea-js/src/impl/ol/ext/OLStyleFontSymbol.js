import OLStyleRegularShape from 'ol/style/RegularShape';
import { asString as colorAsString } from 'ol/color';

/* Copyright (c) 2015 Jean-Marc VIGLINO,
released under the CeCILL-B license (French BSD license)
(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).

*  Add a marker style to use with font symbols
/**
 * @classdesc
 * Set fontsymbol style for vector features.
 *
 */
export default class OLStyleFontSymbol extends OLStyleRegularShape {
  /**
   * @constructor
   * @param {olx.style.FontSymbolOptions=} opt_options Options.
   * @extends {ol.style.RegularShape}
   * @implements {ol.structs.IHasChecksum}
   */
  constructor(options = {}) {
    let strokeWidth = 0;
    if (options.stroke) {
      strokeWidth = options.stroke.getWidth();
    }
    super({
      radius: options.radius,
      fill: options.fill,
      rotation: options.rotation,
      rotateWithView: options.rotateWithView,
    });

    if (typeof options.opacity === 'number') this.setOpacity(options.opacity);
    this.color_ = options.color;
    this.fontSize_ = options.fontSize || 1;
    this.stroke_ = options.stroke;
    this.fill_ = options.fill;
    this.radius_ = options.radius - strokeWidth;
    this.form_ = options.form || 'none';
    this.gradient_ = options.gradient;
    this.offset_ = [options.offsetX ? options.offsetX : 0, options.offsetY ? options.offsetY : 0];

    this.glyph_ = this.getGlyph(options.glyph) || '';

    this.renderMaker();
  }

  /**
   * Clones the style.
   * @return {ol.style.FontSymbol}
   */
  clone() {
    const g = new OLStyleFontSymbol({
      glyph: '',
      color: this.color_,
      fontSize: this.fontSize_,
      stroke: this.stroke_,
      fill: this.fill_,
      radius: this.radius_ + (this.stroke_ ? this.stroke_.getWidth() : 0),
      form: this.form_,
      gradient: this.gradient_,
      offsetX: this.offset_[0],
      offsetY: this.offset_[1],
      opacity: this.getOpacity(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
    });
    g.setScale(this.getScale());
    g.setGlyph(this.getGlyph());
    g.renderMaker();
    return g;
  }

  /**
   * TODO
   */
  setGlyph(glyph) {
    this.glyph_ = glyph;
  }

  /**
   * Static function : add new font defs
   */
  static addDefs(font, glyphs) {
    let thefont = font;
    if (typeof font === 'string') {
      thefont = {
        font,
        name: font,
        copyright: '',
      };
    }
    if (!thefont.font || typeof thefont.font !== 'string') {
      throw new Error('bad font def');
    }
    const fontname = thefont.font;
    OLStyleFontSymbol.defs.fonts[fontname] = thefont;
    Object.keys(glyphs).forEach((key) => {
      let g = glyphs[key];
      if (typeof g === 'string' && g.length === 1) {
        g = {
          char: g,
        };
      }
      OLStyleFontSymbol.defs.glyphs[key] = {
        font: thefont.font,
        char: g.char || `${String.fromCharCode(g.code)}` || '',
        theme: g.theme || thefont.name,
        name: g.name || key,
        search: g.search || '',
      };
    });
  }

  /**
   * Get the fill style for the symbol.
   * @return {ol.style.Fill} Fill style.
   */
  getFill() {
    return this.fill_;
  }

  /**
   * Get the stroke style for the symbol.
   * @return {ol.style.Stroke} Stroke style.
   */
  getStroke() {
    return this.stroke_;
  }

  /**
   * Get the stroke style for the symbol.
   * @return {ol.style.Stroke} Stroke style.
   */
  getGlyph(name) {
    let glyph = this.glyph_;
    if (name) {
      glyph = OLStyleFontSymbol.defs.glyphs[name];
      glyph = glyph || {
        font: 'none',
        char: name.charAt(0),
        theme: 'none',
        name: 'none',
        search: '',
      };
    }
    return glyph;
  }

  /**
   * Get the glyph name.
   * @return {string} the name
   */
  getGlyphName() {
    let glyphName = '';
    Object.keys(OLStyleFontSymbol.defs.glyphs).forEach((key) => {
      if (OLStyleFontSymbol.defs.glyph[key] === this.glyph_) {
        glyphName = key;
      }
    });
    return glyphName;
  }

  /**
   * Get the stroke style for the symbol.
   * @return {ol.style.Stroke} Stroke style.
   */
  getFontInfo(glyph) {
    return OLStyleFontSymbol.defs.fonts[glyph.font];
  }

  /**
   * TODO
   */
  renderMaker(atlasManager) {
    let strokeStyle;
    let strokeWidth = 0;

    if (this.stroke_) {
      strokeStyle = colorAsString(this.stroke_.getColor());
      strokeWidth = this.stroke_.getWidth();
    }

    // no atlas manager is used, create a new canvas
    const canvas = this.getImage(1);

    canvas.height += 1;
    canvas.width += 1;

    const renderOptions = {
      strokeStyle,
      strokeWidth,
      size: canvas.width,
    };

    // draw the circle on the canvas
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawMarker_(renderOptions, context, 0, 0);

    // Set Anchor
    const a = this.getAnchor();
    a[0] = (canvas.width / 2) - this.offset_[0];
    a[1] = (canvas.width / 2) - this.offset_[1];
  }

  /**
   * @private
   * @param {ol.style.FontSymbol.RenderOptions} renderOptions
   * @param {CanvasRenderingContext2D} context
   */
  drawPath_(renderOptions, contextParam) {
    const context = contextParam;
    const s = (2 * this.radius_) + renderOptions.strokeWidth;
    const w = renderOptions.strokeWidth / 2;
    const c = renderOptions.size / 2;
    // Transfo to place the glyph at the right place
    let transfo = {
      fac: 1,
      posX: renderOptions.size / 2,
      posY: renderOptions.size / 2,
    };
    context.lineJoin = 'round';
    context.beginPath();

    // Draw the path with the form
    const pi = Math.PI;
    switch (this.form_) {
      case 'none':
        transfo.fac = 1;
        // const pi = Math.PI;
        break;
      case 'circle':
      case 'ban':
        context.arc(c, c, s / 2, 0, 2 * Math.PI, true);
        break;
      case 'poi':
        context.arc(c, c - (0.4 * this.radius_), 0.6 * this.radius_, 0.15 * pi, 0.85 * pi, true);
        context.lineTo(c - (0.89 * 0.05 * s), ((0.95 + (0.45 * 0.05)) * s) + w);
        context.arc(c, (0.95 * s) + w, 0.05 * s, 0.85 * Math.PI, 0.15 * Math.PI, true);
        transfo = {
          fac: 0.45,
          posX: c,
          posY: c - (0.35 * this.radius_),
        };
        break;
      case 'bubble':
        context.arc(c, c - (0.2 * this.radius_), 0.8 * this.radius_, 0.4 * pi, 0.6 * pi, true);
        context.lineTo((0.5 * s) + w, s + w);
        transfo = {
          fac: 0.7,
          posX: c,
          posY: c - (0.2 * this.radius_),
        };
        break;
      case 'marker':
        context.arc(c, c - (0.2 * this.radius_), 0.8 * this.radius_, 0.25 * pi, 0.75 * pi, true);
        context.lineTo((0.5 * s) + w, s + w);
        transfo = {
          fac: 0.7,
          posX: c,
          posY: c - (0.2 * this.radius_),
        };

        break;
      case 'coma':
        context.moveTo(c + (0.8 * this.radius_), c - (0.2 * this.radius_));
        context.quadraticCurveTo((0.95 * s) + w, (0.75 * s) + w, (0.5 * s) + w, s + w);
        context.arc(c, c - (0.2 * this.radius_), 0.8 * this.radius_, 0.45 * pi, 0, false);
        transfo = {
          fac: 0.7,
          posX: c,
          posY: c - (0.2 * this.radius_),
        };
        break;
      default:
        let pts;
        switch (this.form_) {
          case 'shield':
            pts = [0.05, 0, 0.95, 0, 0.95, 0.8, 0.5, 1, 0.05, 0.8, 0.05, 0];
            transfo.posY = (0.45 * s) + w;
            break;
          case 'blazon':
            pts = [0.1, 0, 0.9, 0, 0.9, 0.8, 0.6, 0.8, 0.5, 1, 0.4, 0.8, 0.1, 0.8, 0.1, 0];
            transfo.fac = 0.8;
            transfo.posY = (0.4 * s) + w;
            break;
          case 'bookmark':
            pts = [0.05, 0, 0.95, 0, 0.95, 1, 0.5, 0.8, 0.05, 1, 0.05, 0];
            transfo.fac = 0.9;
            transfo.posY = (0.4 * s) + w;
            break;
          case 'hexagon':
            pts = [0.05, 0.2, 0.5, 0, 0.95, 0.2, 0.95, 0.8, 0.5, 1, 0.05, 0.8, 0.05, 0.2];
            transfo.fac = 0.9;
            transfo.posY = (0.5 * s) + w;
            break;
          case 'diamond':
            pts = [0.25, 0, 0.75, 0, 1, 0.2, 1, 0.4, 0.5, 1, 0, 0.4, 0, 0.2, 0.25, 0];
            transfo.fac = 0.75;
            transfo.posY = (0.35 * s) + w;
            break;
          case 'triangle':
            pts = [0, 0, 1, 0, 0.5, 1, 0, 0];
            transfo.fac = 0.6;
            transfo.posY = (0.3 * s) + w;
            break;
          case 'sign':
            pts = [0.5, 0.05, 1, 0.95, 0, 0.95, 0.5, 0.05];
            transfo.fac = 0.7;
            transfo.posY = (0.65 * s) + w;
            break;
          case 'lozenge':
            pts = [0.5, 0, 1, 0.5, 0.5, 1, 0, 0.5, 0.5, 0];
            transfo.fac = 0.7;
            break;
          default:
            pts = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0];
            break;
        }
        for (let i = 0; i < pts.length; i += 2) {
          context.lineTo((pts[i] * s) + w, (pts[i + 1] * s) + w);
        }
    }

    context.closePath();
    return transfo;
  }

  /**
   * @private
   * @param {ol.style.FontSymbol.RenderOptions} renderOptions
   * @param {CanvasRenderingContext2D} context
   * @param {number} x The origin for the symbol (x).
   * @param {number} y The origin for the symbol (y).
   */
  drawMarker_(renderOptions, contextParam, x, y) {
    const context = contextParam;
    let fcolor = this.fill_ ? this.fill_.getColor() : '#000';
    let scolor = this.stroke_ ? this.stroke_.getColor() : '#000';
    if (this.form_ === 'none' && this.stroke_ && this.fill_) {
      scolor = this.fill_.getColor();
      fcolor = this.stroke_.getColor();
    }
    // reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    // then move to (x, y)
    context.translate(x, y);

    const tr = this.drawPath_(renderOptions, context);

    if (this.fill_) {
      if (this.gradient_ && this.form_ !== 'none') {
        const grd = context.createLinearGradient(0, 0, renderOptions.size / 2, renderOptions.size);
        grd.addColorStop(1, colorAsString(fcolor));
        grd.addColorStop(0, colorAsString(scolor));
        context.fillStyle = grd;
      } else {
        context.fillStyle = colorAsString(fcolor);
      }
      context.fill();
    }
    if (this.stroke_ && renderOptions.strokeWidth) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      context.stroke();
    }

    // Draw the symbol
    if (this.glyph_.char) {
      context.font = `${(2 * tr.fac * (this.radius_) * this.fontSize_)}px ${this.glyph_.font}`;
      context.strokeStyle = context.fillStyle;
      context.lineWidth = renderOptions.strokeWidth * (this.form_ === 'none' ? 2 : 1);
      context.fillStyle = colorAsString(this.color_ || scolor);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const t = this.glyph_.char;
      if (renderOptions.strokeWidth && scolor !== 'transparent') context.strokeText(t, tr.posX, tr.posY);
      context.fillText(t, tr.posX, tr.posY);
    }

    if (this.form_ === 'ban' && this.stroke_ && renderOptions.strokeWidth) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      const r = this.radius_ + renderOptions.strokeWidth;
      const d = this.radius_ * Math.cos(Math.PI / 4);
      context.moveTo(r + d, r - d);
      context.lineTo(r - d, r + d);
      context.stroke();
    }
  }

  /**
   * @inheritDoc
   */
  getChecksum() {
    const strokeChecksum = (this.stroke_ !== null)
      ? this.stroke_.getChecksum() : '-';
    const fillChecksum = (this.fill_ !== null)
      ? this.fill_.getChecksum() : '-';

    const recalculate = (this.checksums_ === null)
      || (strokeChecksum !== this.checksums_[1]
        || fillChecksum !== this.checksums_[2]
        || this.radius_ !== this.checksums_[3]
        || `${this.form_}-${this.glyphs_ !== this.checksums_[4]}`);

    if (recalculate) {
      /* eslint-disable*/
      const checksum = 'c' + strokeChecksum + fillChecksum +
        ((this.radius_ !== void 0) ? this.radius_.toString() : '-') +
        this.form_ + '-' + this.glyphs_;
      /* eslint-enable */
      this.checksums_ = [checksum, strokeChecksum, fillChecksum, this.radius_, `${this.form_}-${this.glyphs_}`];
    }
    return this.checksums_[0];
  }
}

/**
 * Font defs
 */
OLStyleFontSymbol.defs = {
  fonts: {},
  glyphs: {},
};

// Add Defs
OLStyleFontSymbol.addDefs({
  font: 'g-cartografia',
  name: 'g-cartografia',
  prefix: 'g-cartografia-',
}, {
  'g-cartografia-alerta': {
    font: 'g-cartografia',
    code: 59648,
    name: 'alerta',
    search: 'alerta',
  },
  'g-cartografia-ayuda': {
    font: 'g-cartografia',
    code: 59649,
    name: 'ayuda',
    search: 'ayuda',
  },
  'g-cartografia-bandera': {
    font: 'g-cartografia',
    code: 59650,
    name: 'bandera',
    search: 'bandera',
  },
  'g-cartografia-brujula': {
    font: 'g-cartografia',
    code: 59651,
    name: 'brujula',
    search: 'brujula',
  },
  'g-cartografia-cancelar': {
    font: 'g-cartografia',
    code: 59652,
    name: 'cancelar',
    search: 'cancelar',
  },
  'g-cartografia-cancelar2': {
    font: 'g-cartografia',
    code: 59653,
    name: 'cancelar2',
    search: 'cancelar2',
  },
  'g-cartografia-capas': {
    font: 'g-cartografia',
    code: 59654,
    name: 'capas',
    search: 'capas',
  },
  'g-cartografia-capas2': {
    font: 'g-cartografia',
    code: 59655,
    name: 'capas2',
    search: 'capas2',
  },
  'g-cartografia-check': {
    font: 'g-cartografia',
    code: 59656,
    name: 'check',
    search: 'check',
  },
  'g-cartografia-check2': {
    font: 'g-cartografia',
    code: 59657,
    name: 'check2',
    search: 'check2',
  },
  'g-cartografia-check3': {
    font: 'g-cartografia',
    code: 59658,
    name: 'check3',
    search: 'check3',
  },
  'g-cartografia-check4': {
    font: 'g-cartografia',
    code: 59659,
    name: 'check4',
    search: 'check4',
  },
  'g-cartografia-check5': {
    font: 'g-cartografia',
    code: 59660,
    name: 'check5',
    search: 'check5',
  },
  'g-cartografia-comentarios': {
    font: 'g-cartografia',
    code: 59661,
    name: 'comentarios',
    search: 'comentarios',
  },
  'g-cartografia-descargar': {
    font: 'g-cartografia',
    code: 59662,
    name: 'descargar',
    search: 'descargar',
  },
  'g-cartografia-editar': {
    font: 'g-cartografia',
    code: 59663,
    name: 'editar',
    search: 'editar',
  },
  'g-cartografia-editar2': {
    font: 'g-cartografia',
    code: 59664,
    name: 'editar2',
    search: 'editar2',
  },
  'g-cartografia-escala': {
    font: 'g-cartografia',
    code: 59665,
    name: 'escala',
    search: 'escala',
  },
  'g-cartografia-escala2': {
    font: 'g-cartografia',
    code: 59666,
    name: 'alerta',
    search: 'alerta',
  },
  'g-cartografia-escala3': {
    font: 'g-cartografia',
    code: 59667,
    name: 'escala3',
    search: 'escala3',
  },
  'g-cartografia-flecha': {
    font: 'g-cartografia',
    code: 59668,
    name: 'flecha',
    search: 'flecha',
  },
  'g-cartografia-flecha-abajo': {
    font: 'g-cartografia',
    code: 59669,
    name: 'flecha-abajo',
    search: 'flecha-abajo',
  },
  'g-cartografia-flecha-abajo2': {
    font: 'g-cartografia',
    code: 59670,
    name: 'flecha-abajo2',
    search: 'flecha-abajo2',
  },
  'g-cartografia-flecha-arriba': {
    font: 'g-cartografia',
    code: 59671,
    name: 'flecha-arriba',
    search: 'flecha-arriba',
  },
  'g-cartografia-flecha-arriba2': {
    font: 'g-cartografia',
    code: 59672,
    name: 'alerta',
    search: 'alerta',
  },
  'g-cartografia-flecha-derecha': {
    font: 'g-cartografia',
    code: 59673,
    name: 'flecha-derecha',
    search: 'flecha-derecha',
  },
  'g-cartografia-flecha-derecha2': {
    font: 'g-cartografia',
    code: 59674,
    name: 'flecha-derecha2',
    search: 'flecha-derecha2',
  },
  'g-cartografia-flecha-derecha3': {
    font: 'g-cartografia',
    code: 59675,
    name: 'fleha-derecha3',
    search: 'fleha-derecha3',
  },
  'g-cartografia-flecha-deshacer': {
    font: 'g-cartografia',
    code: 59676,
    name: 'flecha-deshacer',
    search: 'flecha-deshacer',
  },
  'g-cartografia-flecha-izquierda': {
    font: 'g-cartografia',
    code: 59677,
    name: 'flecha-izquierda',
    search: 'flecha-izquierda',
  },
  'g-cartografia-flecha-izquierda2': {
    font: 'g-cartografia',
    code: 59678,
    name: 'flecha-izquierda2',
    search: 'flecha-izquierda2',
  },
  'g-cartografia-flecha-izquierda3': {
    font: 'g-cartografia',
    code: 59679,
    name: 'flecha-izquierda3',
    search: 'flecha-izquierda3',
  },
  'g-cartografia-flecha-link': {
    font: 'g-cartografia',
    code: 59680,
    name: 'flecha-link',
    search: 'flecha-link',
  },
  'g-cartografia-flechas-mover': {
    font: 'g-cartografia',
    code: 59681,
    name: 'flechas-mover',
    search: 'flechas-mover',
  },
  'g-cartografia-gps': {
    font: 'g-cartografia',
    code: 59682,
    name: 'gps',
    search: 'gps',
  },
  'g-cartografia-gps2': {
    font: 'g-cartografia',
    code: 59683,
    name: 'gps2',
    search: 'gps2',
  },
  'g-cartografia-gps3': {
    font: 'g-cartografia',
    code: 59684,
    name: 'gps3',
    search: 'gps3',
  },
  'g-cartografia-gps4': {
    font: 'g-cartografia',
    code: 59685,
    name: 'gps4',
    search: 'gps4',
  },
  'g-cartografia-guardar': {
    font: 'g-cartografia',
    code: 59686,
    name: 'guardar',
    search: 'guardar',
  },
  'g-cartografia-herramienta': {
    font: 'g-cartografia',
    code: 59687,
    name: 'herramienta',
    search: 'herramienta',
  },
  'g-cartografia-impresora': {
    font: 'g-cartografia',
    code: 59688,
    name: 'impresora',
    search: 'impresora',
  },
  'g-cartografia-info': {
    font: 'g-cartografia',
    code: 59689,
    name: 'info',
    search: 'info',
  },
  'g-cartografia-linea': {
    font: 'g-cartografia',
    code: 59690,
    name: 'linea',
    search: 'linea',
  },
  'g-cartografia-lineas': {
    font: 'g-cartografia',
    code: 59691,
    name: 'lineas',
    search: 'lineas',
  },
  'g-cartografia-lista': {
    font: 'g-cartografia',
    code: 59692,
    name: 'lista',
    search: 'lista',
  },
  'g-cartografia-localizacion': {
    font: 'g-cartografia',
    code: 59693,
    name: 'localizacion',
    search: 'localizacion',
  },
  'g-cartografia-localizacion2': {
    font: 'g-cartografia',
    code: 59694,
    name: 'localizacion2',
    search: 'localizacion2',
  },
  'g-cartografia-localizacion3': {
    font: 'g-cartografia',
    code: 59695,
    name: 'localizacion3',
    search: 'localizacion3',
  },
  'g-cartografia-localizacion4': {
    font: 'g-cartografia',
    code: 59696,
    name: 'localizacion4',
    search: 'localizacion4',
  },
  'g-cartografia-mano': {
    font: 'g-cartografia',
    code: 59697,
    name: 'mano',
    search: 'mano',
  },
  'g-cartografia-mano2': {
    font: 'g-cartografia',
    code: 59698,
    name: 'mano2',
    search: 'mano2',
  },
  'g-cartografia-mapa': {
    font: 'g-cartografia',
    code: 59699,
    name: 'mapa',
    search: 'mapa',
  },
  'g-cartografia-mas': {
    font: 'g-cartografia',
    code: 59700,
    name: 'mas',
    search: 'mas',
  },
  'g-cartografia-mas2': {
    font: 'g-cartografia',
    code: 59701,
    name: 'mas2',
    search: 'mas2',
  },
  'g-cartografia-medir-area': {
    font: 'g-cartografia',
    code: 59702,
    name: 'medir-area',
    search: 'medir-area',
  },
  'g-cartografia-medir-linea': {
    font: 'g-cartografia',
    code: 59703,
    name: 'medir-linea',
    search: 'medir-linea',
  },
  'g-cartografia-menos': {
    font: 'g-cartografia',
    code: 59704,
    name: 'menos',
    search: 'menos',
  },
  'g-cartografia-menos2': {
    font: 'g-cartografia',
    code: 59705,
    name: 'alerta',
    search: 'alerta',
  },
  'g-cartografia-menu': {
    font: 'g-cartografia',
    code: 59706,
    name: 'menos2',
    search: 'menos2',
  },
  'g-cartografia-mundo': {
    font: 'g-cartografia',
    code: 59707,
    name: 'mundo',
    search: 'mundo',
  },
  'g-cartografia-mundo2': {
    font: 'g-cartografia',
    code: 59708,
    name: 'mundo2',
    search: 'mundo2',
  },
  'g-cartografia-opciones': {
    font: 'g-cartografia',
    code: 59709,
    name: 'opciones',
    search: 'opciones',
  },
  'g-cartografia-papelera': {
    font: 'g-cartografia',
    code: 59710,
    name: 'papelera',
    search: 'papelera',
  },
  'g-cartografia-pin': {
    font: 'g-cartografia',
    code: 59711,
    name: 'pin',
    search: 'pin',
  },
  'g-cartografia-pin2': {
    font: 'g-cartografia',
    code: 59712,
    name: 'pin2',
    search: 'pin2',
  },
  'g-cartografia-pin3': {
    font: 'g-cartografia',
    code: 59713,
    name: 'pin3',
    search: 'pin3',
  },
  'g-cartografia-pin4': {
    font: 'g-cartografia',
    code: 59714,
    name: 'pin4',
    search: 'pin4',
  },
  'g-cartografia-pin-nuevo': {
    font: 'g-cartografia',
    code: 59715,
    name: 'pin-nuevo',
    search: 'pin-nuevo',
  },
  'g-cartografia-poligono': {
    font: 'g-cartografia',
    code: 59716,
    name: 'poligono',
    search: 'poligono',
  },
  'g-cartografia-posicion': {
    font: 'g-cartografia',
    code: 59717,
    name: 'posicion',
    search: 'posicion',
  },
  'g-cartografia-posicion2': {
    font: 'g-cartografia',
    code: 59718,
    name: 'posicion2',
    search: 'posicion2',
  },
  'g-cartografia-posicion3': {
    font: 'g-cartografia',
    code: 59719,
    name: 'posicion3',
    search: 'posicion3',
  },
  'g-cartografia-posicion4': {
    font: 'g-cartografia',
    code: 59720,
    name: 'posicion4',
    search: 'posicion4',
  },
  'g-cartografia-posicion5': {
    font: 'g-cartografia',
    code: 59721,
    name: 'posicion5',
    search: 'posicion5',
  },
  'g-cartografia-posicion6': {
    font: 'g-cartografia',
    code: 59722,
    name: 'posicion6',
    search: 'posicion6',
  },
  'g-cartografia-posicion7': {
    font: 'g-cartografia',
    code: 59723,
    name: 'posicion7',
    search: 'posicion7',
  },
  'g-cartografia-prismaticos': {
    font: 'g-cartografia',
    code: 59724,
    name: 'prismaticos',
    search: 'prismaticos',
  },
  'g-cartografia-regla': {
    font: 'g-cartografia',
    code: 59725,
    name: 'regla',
    search: 'regla',
  },
  'g-cartografia-reglas': {
    font: 'g-cartografia',
    code: 59726,
    name: 'reglas',
    search: 'reglas',
  },
  'g-cartografia-ruta': {
    font: 'g-cartografia',
    code: 59727,
    name: 'ruta',
    search: 'ruta',
  },
  'g-cartografia-spinner': {
    font: 'g-cartografia',
    code: 59728,
    name: 'spinner',
    search: 'spinner',
  },
  'g-cartografia-spinner2': {
    font: 'g-cartografia',
    code: 59729,
    name: 'spinner2',
    search: 'spinner2',
  },
  'g-cartografia-subir': {
    font: 'g-cartografia',
    code: 59739,
    name: 'subir',
    search: 'subir',
  },
  'g-cartografia-tamano': {
    font: 'g-cartografia',
    code: 59740,
    name: 'tamano',
    search: 'tamano',
  },
  'g-cartografia-temperatura': {
    font: 'g-cartografia',
    code: 59741,
    name: 'temperatura',
    search: 'temperatura',
  },
  'g-cartografia-texto': {
    font: 'g-cartografia',
    code: 59742,
    name: 'texto',
    search: 'texto',
  },
  'g-cartografia-usuario': {
    font: 'g-cartografia',
    code: 59743,
    name: 'usuario',
    search: 'usuario',
  },
  'g-cartografia-usuario2': {
    font: 'g-cartografia',
    code: 59744,
    name: 'usuario2',
    search: 'usuario2',
  },
  'g-cartografia-zoom': {
    font: 'g-cartografia',
    code: 59745,
    name: 'zoom',
    search: 'zoom',
  },
  'g-cartografia-zoom-extension': {
    font: 'g-cartografia',
    code: 59746,
    name: 'zoom-extension',
    search: 'zoom-extension',
  },
  'g-cartografia-zoom-mas': {
    font: 'g-cartografia',
    code: 59747,
    name: 'zoom-mas',
    search: 'zoom-mas',
  },
  'g-cartografia-zoom-menos': {
    font: 'g-cartografia',
    code: 59748,
    name: 'zoom-menos',
    search: 'zoom-menos',
  },
  'g-cartografia-pin5': {
    font: 'g-cartografia',
    code: 59749,
    name: 'pin5',
    search: 'pin5',
  },
  'g-cartografia-pin-nuevo2': {
    font: 'g-cartografia',
    code: 59750,
    name: 'pin-nuevo2',
    search: 'pin-nuevo2',
  },
  'g-cartografia-pin-seleccionado': {
    font: 'g-cartografia',
    code: 59751,
    name: 'pin-seleccionado',
    search: 'pin-seleccionado',
  },
  'g-cartografia-brujula-norte': {
    font: 'g-cartografia',
    code: 59752,
    name: 'brujula-norte',
    search: 'brujula-norte',
  },
});
