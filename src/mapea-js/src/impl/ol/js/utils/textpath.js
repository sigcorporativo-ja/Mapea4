goog.provide('M.impl.textpath');

goog.require('goog.style');

/**
 * @namespace M.impl.textpath
 */
(function() {

  /**
   * Canvas textpath render method. Draws text along path
   * @public
   * @function
   * @see https://github.com/Viglino/ol3-ext/blob/gh-pages/style/settextpathstyle.js#L9
   * @param {string} text
   * @param {Array<Number>} path
   * @api stable
   */
  M.impl.textpath.render = function(text, path) {
    // canvas context
    var ctx = this;

    let di = 0;
    let dpos = 0;
    let pos = 2;

    // gets dist between two points
    const dist2D = (x1, y1, x2, y2) => {
      let [dx, dy] = [x2 - x1, y2 - y1];
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getPoint = (path, dl) => {
      if (!di || (dpos + di < dl)) {
        // we need to max the performance
        for (; pos < path.length;) {
          di = dist2D(path[pos - 2], path[pos - 1], path[pos], path[pos + 1]);
          if (dpos + di > dl) {
            break;
          }
          pos += 2;
          if (pos >= path.length) {
            break;
          }
          dpos += di;
        }
      }

      let dt = dl - dpos;

      if (pos >= path.length) {
        pos = path.length - 2;
      }

      let x = !dt ? path[pos - 2] : (path[pos - 2] + (path[pos] - path[pos - 2]) * dt / di);
      let y = !dt ? path[pos - 1] : (path[pos - 1] + (path[pos + 1] - path[pos - 1]) * dt / di);
      let a = Math.atan2(path[pos + 1] - path[pos - 1], path[pos] - path[pos - 2]);

      return [x, y, a];
    };

    let letterPadding = ctx.measureText(' ').width * 0.25;
    let start = 0;
    let d = 0;

    for (let i = 2; i < path.length; i += 2) {
      d += dist2D(path[i - 2], path[i - 1], path[i], path[i + 1]);
    }

    if (d < ctx.minWidth) {
      return;
    }
    let nbspace = text.split(' ').length - 1;

    if (ctx.textOverflow !== 'visible' && (d < ctx.measureText(text).width + (text.length - 1 + nbspace) * letterPadding)) {
      let overflow = (ctx.textOverflow === 'ellipsis') ? '\u2026' : ctx.textOverflow;
      do {
        nbspace = text.split(' ').length - 1;
        text = text.slice(0, text.length - 1);
      } while (text && d < ctx.measureText(text + overflow).width + (text.length + overflow.length - 1 + nbspace) * letterPadding);
      text += overflow;
    }
    switch (ctx.textJustify || ctx.textAlign) {
      case true: //justify
      case 'center':
      case 'end':
      case 'right':
        if (ctx.textJustify) {
          start = 0;
          letterPadding = (d - ctx.measureText(text).width) / (text.length - 1 + nbspace);
        }
        else {
          start = d - ctx.measureText(text).width - (text.length + nbspace) * letterPadding;
          if (ctx.textAlign === 'center') {
            start /= 2;
          }
        }
        break;
      default:
        break;
    }
    for (let t = 0; t < text.length; t++) {
      let letter = text[t];
      let wl = ctx.measureText(letter).width;
      let p = getPoint(path, start + wl / 2);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.translate(p[0], p[1]);
      ctx.rotate(p[2]);
      if (ctx.lineWidth) {
        ctx.strokeText(letter, 0, 0);
      }
      ctx.fillText(letter, 0, 0);
      ctx.restore();
      start += wl + letterPadding * (letter === ' ' ? 2 : 1);
    }
  };

  /**
   * Parse coordinates to path
   * @private
   * @function
   * @param {Array<number>} c2p coords to pixel array
   * @param {Array<Array<number>>} coords coordinates
   * @param {boolean} readable flag to invert the path
   * @return {Array<number>} builded path
   * @api stable
   */
  M.impl.textpath.getPath_ = function(c2p, coords, readable) {
    var path1 = [];
    coords.forEach((coord) => {
      path1.push(c2p[0] * coord[0] + c2p[1] * coord[1] + c2p[4]);
      path1.push(c2p[2] * coord[0] + c2p[3] * coord[1] + c2p[5]);
    });
    // Revert line ?
    if (readable && path1[0] > path1[path1.length - 2]) {
      var path2 = [];
      for (var h = path1.length - 2; h >= 0; h -= 2) {
        path2.push(path1[h]);
        path2.push(path1[h + 1]);
      }
      return path2;
    }
    else return path1;
  };

  /**
   * Enclose a ol.style into an style function
   * @public
   * @function
   * @param {object} style ol.style
   * @return {function} style enclosed in a function
   * @api stable
   */
  M.impl.textpath.formatStyle = function(style) {
    if (style == null) {
      return null;
    }
    let formattedStyle = null;
    if (typeof style === 'undefined') {
      style = [new ol.style.Style({
        text: new ol.style.Text()
      })];
    }
    if (typeof(style) == 'function') {
      formattedStyle = style;
    }
    else {
      formattedStyle = function() {
        return [style];
      };
    }
    return formattedStyle;
  };


  /**
   * Draws the textpath style if feature or layer has configured it
   * @public
   * @function
   * @param {Object} e received event with framestate
   * @api stable
   */
  M.impl.textpath.draw = function(ctx, textStyle, coords) {
    let path = this.getPath_(coords, textStyle.getRotateWithView());

    ctx.font = textStyle.getFont();
    ctx.textBaseline = textStyle.getTextBaseline();
    ctx.textAlign = textStyle.getTextAlign();
    ctx.lineWidth = textStyle.getStroke() ? (textStyle.getStroke().getWidth() || M.impl.textpath.DEFAULT.lineWidth) : M.impl.textpath.DEFAULT.lineWidth;
    ctx.strokeStyle = textStyle.getStroke() ? (textStyle.getStroke().getColor() || M.impl.textpath.DEFAULT.lineColor) : M.impl.textpath.DEFAULT.lineColor;
    ctx.fillStyle = textStyle.getFill() ? textStyle.getFill().getColor() || M.impl.textpath.DEFAULT.fillColor : M.impl.textpath.DEFAULT.fillColor;
    // New params
    ctx.textJustify = textStyle.getTextAlign() == 'justify';
    ctx.textOverflow = textStyle.getTextOverflow ? textStyle.getTextOverflow() : M.impl.textpath.DEFAULT.textOverflow;
    ctx.minWidth = textStyle.getMinWidth ? textStyle.getMinWidth() : M.impl.textpath.DEFAULT.minWidth;
    // Draw textpath
    if (typeof ctx.textPath === 'function') {
      ctx.textPath(textStyle.getText(), path);
    }

    ctx.restore();
  };

  /**
   * Default textpath style values
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.impl.textpath.DEFAULT = {
    lineWidth: 0,
    lineColor: '#fff',
    fillColor: '#000',
    textOverflow: '',
    minWidth: 0
  };

})();
