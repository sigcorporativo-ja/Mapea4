/**
 * @module M/impl/style/Path
 */
import OLStyleText from 'ol/style/Text';

/**
 * @classdesc
 * @api
 * @namespace M.impl.style.TextPath
 */

class Path extends OLStyleText {
  /**
   * @classdesc
   * Main constructor of the class. Creates a M.impl.style.TextPath style
   *
   * @extends OLStyleText
   * @constructor
   * @param {Object} options - style options
   * @api stable
   */

  constructor(options = {}) {
    // super constructor call
    super(options);

    /**
     * The textOverflow style property.
     * TextOverflow forces changes on text at rendering phase when text size
     * is bigger than feature geometry size
     * @private
     * @type {string}
     */
    this.textOverflow_ = typeof options.textOverflow !== 'undefined' ? options.textOverflow : '';

    /**
     * The minWidth style property
     * this property skips the text rendering when feature geometry width is less than this number
     * @private
     * @type {number}
     */
    this.minWidth_ = options.minWidth || 0;
  }

  /**
   * TextOverflow property getter
   * @public
   * @function
   * @return {number} textOverflow property
   * @api stable
   */
  getTextOverflow() {
    return this.textOverflow_;
  }

  /**
   * MinWidth property getter
   * @public
   * @function
   * @return {number} minWidth property
   * @api stable
   */
  getMinWidth() {
    return this.minWidth_;
  }
}

export default Path;
