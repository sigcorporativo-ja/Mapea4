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
   M.impl.Popup = function (container, opt_options) {
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

      // container
      this.container = container;

      // closer
      this.closer = container.getElementsByClassName('m-popup-closer')[0];
      var this_ = this;

      goog.events.listen(this.closer, goog.events.EventType.CLICK, function (evt) {
         evt.preventDefault();
         this_.hide();
      }, false);

      // content
      this.content = container.getElementsByClassName('m-popup-content')[0];

      // Apply workaround to enable scrolling of content div on touch devices
      M.impl.Popup.enableTouchScroll_(this.content);

      ol.Overlay.call(this, {
         element: this.container,
         stopEvent: true
      });
   };
   ol.inherits(M.impl.Popup, ol.Overlay);

   /**
    * Show the popup.
    * @public
    * @function
    * @param {ol.Coordinate} coord Where to anchor the popup.
    * @param {String} html String of HTML to display within the popup.
    * @api stable
    */
   M.impl.Popup.prototype.show = function (coord) {
      this.setPosition(coord);
      if (this.panMapIfOutOfView) {
         this.panIntoView_(coord);
      }
      this.content.scrollTop = 0;
      return this;
   };

   /**
    * @private
    */
   M.impl.Popup.prototype.panIntoView_ = function (coord) {

      var popSize = {
            width: this.getElement().clientWidth + 20,
            height: this.getElement().clientHeight + 20
         },
         mapSize = this.getMap().getSize();

      var tailHeight = 20,
         tailOffsetLeft = 60,
         tailOffsetRight = popSize.width - tailOffsetLeft,
         popOffset = this.getOffset(),
         popPx = this.getMap().getPixelFromCoordinate(coord);

      var fromLeft = (popPx[0] - tailOffsetLeft),
         fromRight = mapSize[0] - (popPx[0] + tailOffsetRight);

      var fromTop = popPx[1] - popSize.height + popOffset[1],
         fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1];

      var center = this.getMap().getView().getCenter(),
         curPx = this.getMap().getPixelFromCoordinate(center),
         newPx = curPx.slice();

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

      if (newPx[0] !== curPx[0] || newPx[1] !== curPx[1]) {
         this.getMap().getView().setCenter(this.getMap().getCoordinateFromPixel(newPx));
      }

      return this.getMap().getView().getCenter();

   };

   /**
    * @private
    */
   M.impl.Popup.isTouchDevice_ = function () {
      try {
         document.createEvent("TouchEvent");
         return true;
      }
      catch (e) {
         return false;
      }
   };

   /**
    * @private
    */
   M.impl.Popup.enableTouchScroll_ = function (elm) {
      if (M.impl.Popup.isTouchDevice_()) {
         var scrollStartPos = 0;

         goog.events.listen(elm, goog.events.EventType.TOUCHSTART, function (event) {
            scrollStartPos = this.scrollTop + event.touches[0].pageY;
         });

         goog.events.listen(elm, goog.events.EventType.TOUCHMOVE, function (event) {
            this.scrollTop = scrollStartPos - event.touches[0].pageY;
         });
      }
   };

   /**
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.Popup.prototype.hide = function () {
      var map = this.getMap();
      if (!M.utils.isNullOrEmpty(map)) {
         map.removeOverlay(this);
      }
   };

   /**
    * change text popup
    * @public
    * @function
    * @param {text} new text.
    * @api stable
    */
   M.impl.Popup.prototype.setContent = function (text) {
      this.content.innerHTML = text;
   };
})();