/**
 * @module M/style/Font
 */
import OLFontSymbol from 'impl/ext/OLStyleFontSymbol.js';

/**
 * @classdesc
 * @api
 */
class Font {
  /**
   * This method adds custom fonts definitions.
   *
   * @param {object} font
   * @param {object} glyphs
   * @public
   * @static
   * @api
   */
  static addSymbol(font, glyphs) {
    return OLFontSymbol.addDefs(font, glyphs);
  }
}

export default Font;
