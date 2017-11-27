goog.provide('M.impl.style.TextPath');

/**
 * @namespace M.impl.style.TextPath
 */
(function() {
  "use strict";

  /**
   * @classdesc
   * Main constructor of the class. Creates a M.impl.style.TextPath style
   *
   * @extends ol.style.Text
   * @constructor
   * @param {Object} options - style options
   * @api stable
   */
  M.impl.style.TextPath = function(options = {}) {

    // super constructor call
    ol.style.Text.call(this, options);

    /**
     * The textOverflow style property.
     * TextOverflow forces changes on text at rendering phase when text size is bigger than feature geometry size
     * @private
     * @type {string}
     */
    this.textOverflow_ = typeof(options.textOverflow) !== 'undefined' ? options.textOverflow : '';

    /**
     * The minWidth style property
     * this property skips the text rendering when feature geometry width is less than this number
     * @private
     * @type {number}
     */
    this.minWidth_ = options.minWidth || 0;
  };
  ol.inherits(M.impl.style.TextPath, ol.style.Text);

  /**
   * TextOverflow property getter
   * @public
   * @function
   * @return {number} textOverflow property
   * @api stable
   */
  M.impl.style.TextPath.prototype.getTextOverflow = function() {
    return this.textOverflow_;
  };

  /**
   * MinWidth property getter
   * @public
   * @function
   * @return {number} minWidth property
   * @api stable
   */
  M.impl.style.TextPath.prototype.getMinWidth = function() {
    return this.minWidth_;
  };
})();
