goog.provide('M.Popup');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  M.Popup = (function (options) {
    /**
     * TODO
     * @private
     * @type {Array<Number>}
     */
    this.coord_ = null;

    /**
     * TODO
     * @private
     * @type {Array<M.Popup.Tab>}
     */
    this.tabs_ = [];

    /**
     * TODO
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;

    /**
     * TODO
     * @private
     * @type {string}
     */
    this.status_ = M.Popup.status.COLLAPSED;

    var impl = new M.impl.Popup(options);

    // calls the super constructor
    goog.base(this, impl);
  });
  goog.inherits(M.Popup, M.facade.Base);

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.getTabs = function () {
    return this.tabs_;
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.removeTab = function (tabToRemove) {
    this.tabs_ = this.tabs_.filter(function (tab) {
      return (tab.content !== tabToRemove.content);
    });
    this.update();
  };
  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.addTab = function (tabOptions) {
    var tab = tabOptions;
    if (!(tab instanceof M.Popup.Tab)) {
      tab = new M.Popup.Tab(tabOptions);
    }
    this.tabs_.push(tab);
    this.update();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.addTo = function (map, coordinate) {
    this.map_ = map;
    if (M.utils.isNullOrEmpty(this.element_)) {
      var this_ = this;
      M.template.compile(M.Popup.TEMPLATE, {
        'jsonp': true,
        'vars': {
          'tabs': this.tabs_
        }
      }).then(function (html) {
        this_.element_ = html;
        this_.addEvents(html);
        this_.getImpl().addTo(map, html);
        this_.show(coordinate);
      });
    }
    else {
      this.getImpl().addTo(map, this.element_);
      this.show(coordinate);
    }
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.update = function () {
    if (!M.utils.isNullOrEmpty(this.map_)) {
      var this_ = this;
      M.template.compile(M.Popup.TEMPLATE, {
        'jsonp': true,
        'vars': {
          'tabs': this.tabs_
        }
      }).then(function (html) {
        this_.element_ = html;
        this_.addEvents(html);
        this_.getImpl().setContainer(html);
        this_.show(this_.coord_);
      });
    }
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.show = function (coord) {
    this.coord_ = coord;
    this.getImpl().show(this.coord_, function () {
      this.fire(M.evt.SHOW);
    }.bind(this));
    // this.setStatus_(M.Popup.status.COLLAPSED);
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.hide = function (evt) {
    if (!M.utils.isNullOrEmpty(evt)) {
      evt.preventDefault();
    }
    this.getImpl().hide();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.switchTab = function (index) {
    if (this.tabs_.length > index) {
      var tab = this.tabs_[index];
      this.setContent_(tab.content);
      this.show(this.coord_);
    }
  };

  /**
   * TODO
   * @private
   * @function
   */
  M.Popup.prototype.setContent_ = function (content) {
    this.getImpl().setContent(content);
  };

  /**
   * TODO
   * @private
   * @function
   */
  M.Popup.prototype.getContent = function () {
    return this.getImpl().getContent();
  };

  /**
   * TODO
   * @private
   * @function
   */
  M.Popup.prototype.addEvents = function (html) {
    // adds tabs events
    var touchstartY;
    var tabs = html.querySelectorAll('div.m-tab');
    Array.prototype.forEach.call(tabs, function (tab) {
      goog.events.listen(tab, [
            goog.events.EventType.CLICK,
            goog.events.EventType.TOUCHEND
         ], function (evt) {
        evt.preventDefault();
        // 5px tolerance
        var touchendY = evt.clientY;
        if ((evt.type === goog.events.EventType.CLICK) || (Math.abs(touchstartY - touchendY) < 5)) {
          // remove m-activated from all tabs
          Array.prototype.forEach.call(tabs, function (addedTab) {
            goog.dom.classlist.remove(addedTab, 'm-activated');
          });
          goog.dom.classlist.add(tab, 'm-activated');
          var index = tab.getAttribute('data-index');
          this.switchTab(index);
        }
      }, false, this);
    }, this);

    // adds close event
    var closeBtn = html.querySelector('a.m-popup-closer');
    goog.events.listen(closeBtn, [
         goog.events.EventType.CLICK,
         goog.events.EventType.TOUCHEND
      ], this.hide, false, this);

    // mobile events
    var headerElement = html.querySelector('div.m-tabs');
    if (M.utils.isNullOrEmpty(headerElement)) {
      headerElement = html.querySelector('div.m-content > div.m-header');
    }
    if (!M.utils.isNullOrEmpty(headerElement)) {
      var topPosition;
      goog.events.listen(headerElement, [
            goog.events.EventType.TOUCHSTART
         ], function (evt) {
        evt.preventDefault();
        touchstartY = evt.clientY;
        if (this.status_ === M.Popup.status.COLLAPSED) {
          topPosition = 0.9 * M.window.HEIGHT;
        }
        else if (this.status_ === M.Popup.status.DEFAULT) {
          topPosition = 0.45 * M.window.HEIGHT;
        }
        else if (this.status_ === M.Popup.status.FULL) {
          topPosition = 0;
        }
        goog.dom.classlist.add(html, 'm-no-animation');
      }, false, this);

      goog.events.listen(headerElement, [
            goog.events.EventType.TOUCHMOVE
         ], function (evt) {
        evt.preventDefault();
        var touchY = evt.clientY;
        var translatedPixels = touchY - touchstartY;
        goog.style.setStyle(html, 'top', (topPosition + translatedPixels) + 'px');
      }, false, this);

      goog.events.listen(headerElement, [
            goog.events.EventType.TOUCHEND
         ], function (evt) {
        evt.preventDefault();
        var touchendY = evt.clientY;
        this.manageCollapsiblePopup_(touchstartY, touchendY);
      }, false, this);

      // CLICK EVENTS
      goog.events.listen(headerElement, [
            goog.events.EventType.MOUSEUP
         ], function (evt) {
        evt.preventDefault();
        // COLLAPSED --> DEFAULT
        if (this.status_ === M.Popup.status.COLLAPSED) {
          this.setStatus_(M.Popup.status.DEFAULT);
        }
        // DEFAULT --> FULL
        else if (this.status_ === M.Popup.status.DEFAULT) {
          this.setStatus_(M.Popup.status.FULL);
        }
        else {
          this.setStatus_(M.Popup.status.COLLAPSED);
        }
      }, false, this);
    }
  };

  /**
   * TODO
   * @private
   * @function
   */
  M.Popup.prototype.setStatus_ = function (status) {
    if (status !== this.status_) {
      goog.dom.classlist.remove(this.element_, this.status_);
      this.status_ = status;
      goog.dom.classlist.add(this.element_, this.status_);
      goog.style.setStyle(this.element_, 'top', '');
      goog.dom.classlist.remove(this.element_, 'm-no-animation');
      // mobile center
      if (M.window.WIDTH <= M.config.MOBILE_WIDTH) {
        this.getImpl().centerByStatus(status, this.coord_);
      }
    }
  };

  /**
   * TODO
   * @private
   * @function
   */
  M.Popup.prototype.manageCollapsiblePopup_ = function (touchstartY, touchendY) {
    var touchPerc = (touchendY * 100) / M.window.HEIGHT;
    var distanceTouch = Math.abs(touchstartY - touchendY);
    var distanceTouchPerc = (distanceTouch * 100) / M.window.HEIGHT;
    // 10% tolerance
    if (distanceTouchPerc > 10) {

      /*
       * manages collapsing events depending on
       * the current position of the popup header and the direction
       *
       * These are the thresholds:
       *  _____________     ____________
       * |     0%      |       FULL
       * |-------------|
       * |             |
       * |     45%     |
       * |             | 2
       * |-------------|   ------------
       * |             | 1      DEFAULT
       * |             |
       * |             |
       * |-------------|   ------------
       * |     85%     |      COLLAPSED
       * |_____________|
       *
       */
      if (this.status_ === M.Popup.status.COLLAPSED) {
        // 2
        if (touchPerc < 45) {
          this.setStatus_(M.Popup.status.FULL);
        }
        // 1
        else if (touchPerc < 85) {
          this.setStatus_(M.Popup.status.DEFAULT);
        }
        else {
          this.setStatus_(M.Popup.status.COLLAPSED);
        }
      }
      else if (this.status_ === M.Popup.status.DEFAULT) {
        // 1
        if (touchPerc > 45) {
          this.setStatus_(M.Popup.status.COLLAPSED);
        }
        // 2
        else if (touchPerc < 45) {
          this.setStatus_(M.Popup.status.FULL);
        }
        else {
          this.setStatus_(M.Popup.status.DEFAULT);
        }
      }
      else if (this.status_ === M.Popup.status.FULL) {
        // 1
        if (touchPerc > 45) {
          this.setStatus_(M.Popup.status.COLLAPSED);
        }
        // 2
        else if (touchPerc > 0) {
          this.setStatus_(M.Popup.status.DEFAULT);
        }
        else {
          this.setStatus_(M.Popup.status.FULL);
        }
      }
    }
    else {
      this.setStatus_(this.status_);
    }
  };


  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.getCoordinate = function () {
    return this.coord_;
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.setCoordinate = function (coord) {
    this.coord_ = coord;
    this.getImpl().show(coord);
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Popup.prototype.destroy = function () {
    this.tabs_.length = 0;
    this.coord_ = null;
    this.fire(M.evt.DESTROY);
  };

  /**
   * Template for popup
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.Popup.TEMPLATE = 'popup.html';

  /**
   * status of this popup
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.Popup.status = {};

  /**
   * collapsed status of this popup
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.Popup.status.COLLAPSED = 'm-collapsed';

  /**
   * default status of this popup
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.Popup.status.DEFAULT = 'm-default';

  /**
   * full status of this popup
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.Popup.status.FULL = 'm-full';

  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   */
  M.Popup.Tab = (function (options) {
    options = (options || {});

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.icon = options.icon;

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.title = options.title;

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.content = options.content;
  });
})();
