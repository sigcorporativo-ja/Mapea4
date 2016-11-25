goog.provide('M.impl.Popup');

goog.require('goog.events');
goog.require('ol.Overlay');

(function () {

  /**
   * OpenLayers 3 Popup Overlay.
   * @constructor
   * @extends {ol.Overlay}
   * @api stable
   */
  M.impl.Popup = function (opt_options) {
    var options = opt_options || {};

    /**
     * Flag to indicate if map does pan or not
     * @private
     * @type {boolean}
     * @api stable
     */
    this.panMapIfOutOfView = options.panMapIfOutOfView;
    if (this.panMapIfOutOfView === undefined) {
      this.panMapIfOutOfView = true;
    }

    /**
     * Animation
     * @private
     * @type {ol.animation}
     * @api stable
     */
    this.ani = options.ani;
    if (this.ani === undefined) {
      this.ani = ol.animation.pan;
    }

    /**
     * Animation options
     * @private
     * @type {object}
     * @api stable
     */
    this.ani_opts = options.ani_opts;
    if (this.ani_opts === undefined) {
      this.ani_opts = {
        'duration': 250
      };
    }

    /**
     * TODO
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * TODO
     * @private
     * @type {ol.Coordinate}
     */
    this.cachedAniPixel_ = null;
  };
  goog.inherits(M.impl.Popup, ol.Overlay);

  /**
   * TODO
   * @public
   * @function
   * @param {M.Map}
   * @param {String} html String of HTML to display within the popup.
   * @api stable
   */
  M.impl.Popup.prototype.addTo = function (map, html) {
    this.facadeMap_ = map;

    // container
    this.container = html;

    this.content = this.getContentFromContainer_(html);

    // Apply workaround to enable scrolling of content div on touch devices
    M.utils.enableTouchScroll(this.content);

    ol.Overlay.call(this, {
      element: this.container,
      stopEvent: true
    });

    map.getMapImpl().addOverlay(this);
  };

  /**
   * Show the popup.
   * @public
   * @function
   * @param {ol.Coordinate} coord Where to anchor the popup.
   * @param {String} html String of HTML to display within the popup.
   * @api stable
   */
  M.impl.Popup.prototype.show = function (coord, callback) {
    this.setPosition(coord);
    if (this.panMapIfOutOfView) {
      this.panIntoView_(coord);
    }
    this.content.scrollTop = 0;
    if (M.utils.isFunction(callback)) {
      callback();
    }
    return this;
  };

  /**
   * Center the popup
   * @public
   * @function
   * @param {ol.Coordinate} coord Where to anchor the popup.
   * @param {String} html String of HTML to display within the popup.
   * @api stable
   */
  M.impl.Popup.prototype.centerByStatus = function (status, coord) {
    var resolution = this.getMap().getView().getResolution();
    var newCoord = [].concat(coord);
    if (status === M.Popup.status.COLLAPSED) {
      newCoord[1] -= 0.1 * M.window.HEIGHT * resolution;
    }
    else if (status === M.Popup.status.DEFAULT) {
      newCoord[1] -= 0.275 * M.window.HEIGHT * resolution;
    }
    else { // FULL state no effects
      return;
    }

    let featureCenter = this.facadeMap_.getFeatureCenter();
    this.facadeMap_.setCenter({
      'x': newCoord[0],
      'y': newCoord[1]
    });
    // if the center was drawn then draw it again
    if (!M.utils.isNullOrEmpty(featureCenter)) {
      this.facadeMap_.getImpl().drawFeatures([featureCenter]);
    }
  };

  /**
   * @private
   */
  M.impl.Popup.prototype.getContentFromContainer_ = function (html) {
    return html.querySelector('div.m-body');
  };


  /**
   * @private
   */
  M.impl.Popup.prototype.panIntoView_ = function (coord) {
    // it waits for the previous animation in order to execute this
    this.panIntoSynchronizedAnim_().then(function () {
      this.isAnimating_ = true;
      if (M.window.WIDTH > 768) {
        var tabHeight = 30; // 30px for tabs
        var popupElement = this.getElement();
        var popupWidth = popupElement.clientWidth + 20;
        var popupHeight = popupElement.clientHeight + 20 + tabHeight;
        var mapSize = this.getMap().getSize();

        var center = this.getMap().getView().getCenter();
        var tailHeight = 20;
        var tailOffsetLeft = 60;
        var tailOffsetRight = popupWidth - tailOffsetLeft;
        var popOffset = this.getOffset();
        var popPx = this.getMap().getPixelFromCoordinate(coord);

        if (!M.utils.isNullOrEmpty(popPx)) {
          var fromLeft = (popPx[0] - tailOffsetLeft);
          var fromRight = mapSize[0] - (popPx[0] + tailOffsetRight);

          var fromTop = popPx[1] - popupHeight + popOffset[1];
          var fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1];

          var curPix = this.getMap().getPixelFromCoordinate(center);
          var newPx = curPix.slice();

          if (fromRight < 0) {
            newPx[0] -= fromRight;
          }
          else if (fromLeft < 0) {
            newPx[0] += fromLeft;
          }

          if (fromTop < 0) {
            newPx[1] += fromTop;
          }
          else if (fromBottom < 0) {
            newPx[1] -= fromBottom;
          }

          if (this.ani && this.ani_opts) {
            this.ani_opts.source = center;
            this.getMap().beforeRender(this.ani(this.ani_opts));
          }

          if (newPx[0] !== curPix[0] || newPx[1] !== curPix[1]) {
            this.getMap().getView().setCenter(this.getMap().getCoordinateFromPixel(newPx));
          }
        }
      }
      // the animation ended
      this.isAnimating_ = false;
    }.bind(this));

    return this.getMap().getView().getCenter();
  };

  /**
   * @private
   */
  M.impl.Popup.prototype.panIntoSynchronizedAnim_ = function () {
    return (new Promise(function (success, fail) {
      /* if the popup is animating then it waits for the animation
      in order to execute the next animation */
      if (this.isAnimating_ === true) {
        // gets the duration of the animation
        let aniDuration = 300;
        if (this.ani && this.ani_opts) {
          aniDuration = this.ani_opts['duration'];
        }
        setTimeout(success, aniDuration);
      }
      else {
        /* if there is not any animation then it starts
        a new one */
        success();
      }
    }.bind(this)));
  };

  /**
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.Popup.prototype.hide = function () {
    this.facadeMap_.removePopup();
  };

  /**
   * change text popup
   * @public
   * @function
   * @param {text} new text.
   * @api stable
   */
  M.impl.Popup.prototype.setContainer = function (html) {
    this.setElement(html);
    //      this.container.innerHTML = html.innerHTML;
    this.content = this.getContentFromContainer_(html);
    M.utils.enableTouchScroll(this.content);
  };

  /**
   * change text popup
   * @public
   * @function
   * @param {text} new text.
   * @api stable
   */
  M.impl.Popup.prototype.setContent = function (content) {
    this.content.innerHTML = content;
  };

  /**
   * change text popup
   * @public
   * @function
   * @param {text} new text.
   * @api stable
   */
  M.impl.Popup.prototype.getContent = function () {
    return this.content;
  };
})();
