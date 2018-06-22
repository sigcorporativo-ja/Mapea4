import Utils from "./utils/utils.js"
import Exception from "./exception/exception.js"
import Base from "./facade.js"

export class Popup extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  constructor(options) {

    // calls the super constructor
    super();

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
    // this.status_ = M.Popup.status.COLLAPSED;
    this.status_ = Popup.status.COLLAPSED;

    let impl = new Impl(options);

  };
  // goog.inherits(M.Popup, M.facade.Base);

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  get tabs() {
    return this.tabs_;
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  removeTab(tabToRemove) {
    this.tabs_ = this.tabs_.filter(tab => tab.content !== tabToRemove.content);
    this.update();
  };
  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  addTab(tabOptions) {
    let tab = tabOptions;
    if (!(tab instanceof Tab)) {
      tab = new Tab(tabOptions);
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
  addTo(map, coordinate) {
    this.map_ = map;
    if (Utils.isNullOrEmpty(this.element_)) {
      Template.compile(Popup.TEMPLATE, {
        'jsonp': true,
        'vars': {
          'tabs': this.tabs_
        }
      }).then((html) => {
        if (this.tabs_.length > 0) {
          this.element_ = html;
          this.addEvents(html);
          this.impl.addTo(map, html);
          this.show(coordinate);
        }
      });
    } else {
      this.impl.addTo(map, this.element_);
      this.show(coordinate);
    }
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  update() {
    if (!Utils.isNullOrEmpty(this.map_)) {
      Template.compile(Popup.TEMPLATE, {
        'jsonp': true,
        'vars': {
          'tabs': this.tabs_
        }
      }).then(function (html) {
        if (this.tabs_.length > 0) {
          this.element_ = html;
          this.addEvents(html);
          this.impl.Container = html;
          this.show(this.coord_);
        }
      });
    }
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  show(coord) {
    this.coord_ = coord;
    this.impl.show(this.coord_, () => {
      this.fire(Evt.SHOW);
    }.bind(this));
    // this.setStatus_(M.Popup.status.COLLAPSED);
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  hide(evt) {
    if (!Utils.isNullOrEmpty(evt)) {
      Evt.preventDefault();
    }
    this.impl.hide();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  switchTab(index) {
    if (this.tabs_.length > index) {
      let tab = this.tabs_[index];
      this.Content_ = tab.content;
      this.show(this.coord_);
    }
  };

  /**
   * TODO
   * @private
   * @function
   */
  set Content_(value) {
    this.impl.Content = value;
  };

  /**
   * TODO
   * @private
   * @function
   */
  get Content() {
    return this.impl.getContent();
  };

  /**
   * TODO
   * @private
   * @function
   */
  addEvents(html) {
    // adds tabs events
    let touchstartY;
    let tabs = html.querySelectorAll('div.m-tab');
    Array.forEach.call(tabs, (tab) => {

      tab.addEventListener('click', evt, false),
        tab.addEventListener('touchend', evt, false)
    }(evt) => {
      Evt.preventDefault();
      // 5px tolerance
      let touchendY = Evt.clientY;
      if ((Evt.type === "click") || (Math.abs(touchstartY - touchendY) < 5)) {
        // remove m-activated from all tabs
        Array.forEach.call(tabs, (addedTab) => {
          tab.classList.add(addedTab)
        });
        tab.classList.add('m-activated');
        let index = tab.Attribute('data-index');
        this.switchTab(index);
      }
    }, false, this);
  }, this);

// adds close event
let closeBtn = html.querySelector('a.m-popup-closer');
closeBtn.addEventListener("click", this.hide, false);
closeBtn.addEventListener("touchend", this.hide, false);
// mobile events
let headerElement = html.querySelector('div.m-tabs');
if (Utils.isNullOrEmpty(headerElement)) {
  headerElement = html.querySelector('div.m-content > div.m-header');
}
if (!Utils.isNullOrEmpty(headerElement)) {
  let topPosition;
  headerElement.addEventListener("touchstart", (evt) => {
    evt.preventDefault();
    touchstartY = Evt.clientY;
    if (this.status_ === Popup.status.COLLAPSED) {
      topPosition = 0.9 * window.HEIGHT;
    } else if (this.status_ === Popup.status.DEFAULT) {
      topPosition = 0.45 * window.HEIGHT;
    } else if (this.status_ === Popup.status.FULL) {
      topPosition = 0;
    }
    html.classList.add(html, 'm-no-animation');
  }, false, this), false);


headerElement.addEventListener('touchmove', (evt) => {
  Evt.preventDefault();
  let touchY = evt.clientY;
  let translatedPixels = touchY - touchstartY;
  Style.setStyle(html, 'top', (topPosition + translatedPixels) + 'px');
}, false, this);


headerElement.addEventListener("touchend", (evt) => {
Evt.preventDefault();
let touchendY = Evt.clientY;
this.manageCollapsiblePopup_(touchstartY, touchendY);
}, false, this);)

// CLICK EVENTS
headerElement.addEventListener("mouseup", (evt) => {
  Evt.preventDefault(), false);

// COLLAPSED --> DEFAULT
if (this.tabs_.length <= 1) {

  if (this.status_ === Popup.status.COLLAPSED) {
    this.Status_ = Popup.status.DEFAULT;
  }
  // DEFAULT --> FULL
  else if (this.status_ === Popup.status.DEFAULT) {
    this.Status_ = Popup.status.FULL;
  } else {
    this.Status_Popup.status.COLLAPSED;
  }
}
}, false, this);
}
};

/**
 * TODO
 * @private
 * @function
 */
set Status_(status) {
  if (status !== this.status_) {
    status.classlist.remove(this.element_, this.status_);
    this.status_ = status;
    status.classlist.add(this.element_, this.status_);
    status.style.setStyle(this.element_, 'top', '');
    status.classlist.remove(this.element_, 'm-no-animation');
    // mobile center
    if (window.WIDTH <= config.MOBILE_WIDTH) {
      this.impl.centerByStatus(status, this.coord_);
    }
  }
};

/**
 * TODO
 * @private
 * @function
 */
manageCollapsiblePopup_(touchstartY, touchendY) {
  let touchPerc = (touchendY * 100) / window.HEIGHT;
  let distanceTouch = Math.abs(touchstartY - touchendY);
  let distanceTouchPerc = (distanceTouch * 100) / window.HEIGHT;
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
    if (this.status_ === Popup.status.COLLAPSED) {
      // 2
      if (touchPerc < 45) {
        this.Status_ = Popup.status.FULL;
      }
      // 1
      else if (touchPerc < 85) {
        this.Status_ = Popup.status.DEFAULT;
      } else {
        this.Status_ = Popup.status.COLLAPSED;
      }
    } else if (this.status_ === Popup.status.DEFAULT) {
      // 1
      if (touchPerc > 45) {
        this.Status_ = Popup.status.COLLAPSED;
      }
      // 2
      else if (touchPerc < 45) {
        this.Status_ = Popup.status.FULL;
      } else {
        this.Status_ = Popup.status.DEFAULT;
      }
    } else if (this.status_ === Popup.status.FULL) {
      // 1
      if (touchPerc > 45) {
        this.Status_ = Popup.status.COLLAPSED;
      }
      // 2
      else if (touchPerc > 0) {
        this.Status_ = Popup.status.DEFAULT;
      } else {
        this.Status_ = Popup.status.FULL;
      }
    }
  } else {
    this.Status_(this.status_);
  }
};


/**
 * TODO
 * @public
 * @function
 * @api stable
 */
get Coordinate() {
  return this.coord_;
};

/**
 * TODO
 * @public
 * @function
 * @api stable
 */
set Coordinate(coord) {
  this.coord_ = coord;
  if (!Utils.isNullOrEmpty(this.element_)) {
    this.impl.show(coord);
  }
};

/**
 * TODO
 * @public
 * @function
 * @api stable
 */
destroy() {
  this.tabs_.length = 0;
  this.coord_ = null;
  this.fire(Evt.DESTROY);
};

/**
 * Template for popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.TEMPLATE = 'popup.html';

/**
 * status of this popup
 * @const
 * @type {object}
 * @public
 * @api stable
Popup.status = {};
*/

/**
 * collapsed status of this popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.status.COLLAPSED = 'm-collapsed';

/**
 * default status of this popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.status.DEFAULT = 'm-default';

/**
 * full status of this popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.status.FULL = 'm-full';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 *
 * @constructor
 */
export class Tab {

  constructor(options) {

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
  }
}
