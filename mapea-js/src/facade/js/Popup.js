/**
 * @module M/Popup
 */
import PopupImpl from 'impl/Popup.js';
import 'assets/css/popup.css';
import popupTemplate from 'templates/popup.html';
import { isNullOrEmpty, reproject, getSystem } from './util/Utils.js';
import Base from './Base.js';
import { compileSync as compileTemplate } from './util/Template.js';
import * as EventType from './event/eventtype';
import MWindow from './util/Window.js';

/**
 * getUrlFromPlatform
 * @private
 * @function
 */
const getUrlFromPlatform = (platform, coords) => {
  const platformURL = {
    android: coord => `geo:${coord[1]}},${coord[0]}?q=${coord[1]},${coord[0]}`,
    ios: coord => `maps://?ll=${coord[1]},${coord[0]}`,
    unknown: coord => `http://maps.google.com?q=${coord[1]},${coord[0]}`,
  };
  return platformURL[platform](coords);
};

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 */
class Tab {
  /**
   * @constructor
   */
  constructor(options = {}) {
    /**
     * TODO
     * @public
     * @type {String}
     */
    this.icon = options.icon;

    /**
     * TODO
     * @public
     * @type {String}
     */
    this.title = options.title;

    /**
     * TODO
     * @public
     * @type {String}
     */
    this.content = options.content;

    /**
     * TODO
     * @public
     * @type {Array<object>}
     */
    this.listeners = options.listeners || [];
  }
}

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class Popup extends Base {
  /**
   * @constructor
   * @extends {M.facade.Base}
   * @api
   */
  constructor(options) {
    const impl = new PopupImpl(options);
    // calls the super constructor
    super(impl);

    /**
     * TODO
     * @private
     * @type {Array<Number>}
     */
    this.coord_ = null;

    /**
     * TODO
     * @private
     * @type {Array<Popup.Tab>}
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
    this.status_ = Popup.status.COLLAPSED;
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  getTabs() {
    return this.tabs_;
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  removeTab(tabToRemove) {
    this.tabs_ = this.tabs_.filter(tab => tab.content !== tabToRemove.content);
    this.update();
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  addTab(tabOptions) {
    let tab = tabOptions;
    if (!(tab instanceof Tab)) {
      tab = new Tab(tabOptions);
    }
    this.tabs_.push(tab);
    this.update();
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  addTo(map, coordinate) {
    this.map_ = map;
    if (isNullOrEmpty(this.element_)) {
      const coords = reproject(coordinate, this.map_.getProjection().code, 'EPSG:4326');
      const platform = getSystem();

      const html = compileTemplate(popupTemplate, {
        jsonp: true,
        vars: {
          tabs: this.tabs_,
          options: Popup.options,
          url: getUrlFromPlatform(platform, coords),
        },
      });
      if (this.tabs_.length > 0) {
        this.element_ = html;
        this.addEvents(html);
        this.getImpl().addTo(map, html);
        this.show(coordinate);
      }
    } else {
      this.getImpl().addTo(map, this.element_);
      this.show(coordinate);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  update() {
    if (!isNullOrEmpty(this.map_)) {
      const coords = reproject(this.coord_, this.map_.getProjection().code, 'EPSG:4326');
      const platform = getSystem();

      const html = compileTemplate(popupTemplate, {
        jsonp: true,
        vars: {
          tabs: this.tabs_,
          options: Popup.options,
          url: getUrlFromPlatform(platform, coords),
        },
      });
      if (this.tabs_.length > 0) {
        this.element_ = html;
        this.addEventTabs(this.tabs_[0], html);
        this.addEvents(html);
        this.getImpl().setContainer(html);
        this.show(this.coord_);
      }
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  show(coord) {
    this.coord_ = coord;
    this.getImpl().show(this.coord_, () => {
      this.fire(EventType.SHOW);
    });
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  hide(evt) {
    if (!isNullOrEmpty(evt)) {
      evt.preventDefault();
    }
    this.getImpl().hide();
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  switchTab(index) {
    if (this.tabs_.length > index) {
      const tab = this.tabs_[index];
      this.setContent_(tab.content);
      this.addEventTabs(tab, this.getContent());
      this.show(this.coord_);
    }
  }

  /**
   * This functions adds the events to the popup tabs.
   *
   * @function
   * @public
   * @api
   */
  addEventTabs(tab, html) {
    const { listeners } = tab;
    listeners.forEach((listener) => {
      if (listener.all === true) {
        html.querySelectorAll(listener.selector).forEach((element) => {
          element.addEventListener(listener.type, e => listener.callback(e));
        });
      } else {
        html.querySelector(listener.selector)
          .addEventListener(listener.type, e => listener.callback(e));
      }
    });
  }

  /**
   * TODO
   * @private
   * @function
   */
  setContent_(content) {
    this.getContent().innerHTML = content;
  }

  /**
   * TODO
   * @private
   * @function
   */
  getContent() {
    return this.getImpl().getContent();
  }

  /**
   * TODO
   * @private
   * @function
   */
  addEvents(htmlParam) {
    const html = htmlParam;
    // adds tabs events
    let touchstartY;
    const tabs = html.querySelectorAll('div.m-tab');
    Array.prototype.forEach.call(tabs, (tab) => {
      tab.addEventListener('click', (evt) => {
        evt.preventDefault();
        // 5px tolerance
        const touchendY = evt.clientY;
        if ((evt.type === 'click') || (Math.abs(touchstartY - touchendY) < 5)) {
          // remove m-activated from all tabs
          Array.prototype.forEach.call(tabs, (addedTab) => {
            addedTab.classList.remove('m-activated');
          });
          tab.classList.add('m-activated');
          const index = tab.getAttribute('data-index');
          this.switchTab(index);
        }
      });
      tab.addEventListener('touchend', (evt) => {
        evt.preventDefault();
        // 5px tolerance
        const touchendY = evt.clientY;
        if ((evt.type === 'touchend') || (Math.abs(touchstartY - touchendY) < 5)) {
          // remove m-activated from all tabs
          Array.prototype.forEach.call(tabs, (addedTab) => {
            addedTab.classList.remove('m-activated');
          });
          tab.classList.add('m-activated');
          const index = tab.getAttribute('data-index');
          this.switchTab(index);
        }
      });
    });
    // adds close event
    const closeBtn = html.querySelector('a.m-popup-closer');
    closeBtn.addEventListener('click', this.hide.bind(this), false);
    closeBtn.addEventListener('touchend', this.hide.bind(this), false);
    // mobile events
    let headerElement = html.querySelector('div.m-tabs');
    if (isNullOrEmpty(headerElement)) {
      headerElement = html.querySelector('div.m-content > div.m-header');
    }
    if (!isNullOrEmpty(headerElement)) {
      let topPosition;
      headerElement.addEventListener('touchstart', (evt) => {
        evt.preventDefault();
        touchstartY = evt.touches[0].clientY;
        if (this.status_ === Popup.status.COLLAPSED) {
          topPosition = 0.9 * MWindow.HEIGHT;
        } else if (this.status_ === Popup.status.DEFAULT) {
          topPosition = 0.45 * MWindow.HEIGHT;
        } else if (this.status_ === Popup.status.FULL) {
          topPosition = 0;
        }
        html.classList.add('m-no-animation');
      }, false);
      headerElement.addEventListener('touchmove', (evt) => {
        evt.preventDefault();
        this.touchY = evt.touches[0].clientY;
        const translatedPixels = this.touchY - touchstartY;
        html.style.top = `${topPosition + translatedPixels}px`;
      }, false);
      headerElement.addEventListener('touchend', (evt) => {
        evt.preventDefault();
        this.manageCollapsiblePopup_(touchstartY, this.touchY);
      }, false);
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      setTimeout(() => this.manageTransform(mediaQuery, html), 10);
      mediaQuery.addEventListener('change', (e) => { this.manageTransform(e, html); });
      // CLICK EVENTS
      headerElement.addEventListener('mouseup', (evt) => {
        evt.preventDefault();
        // COLLAPSED --> DEFAULT
        if (this.tabs_.length <= 1) {
          if (this.status_ === Popup.status.COLLAPSED) {
            this.setStatus_(Popup.status.DEFAULT);
          } else if (this.status_ === Popup.status.DEFAULT) {
            // DEFAULT --> FULL
            this.setStatus_(Popup.status.FULL);
          } else {
            this.setStatus_(Popup.status.COLLAPSED);
          }
        }
      });
    }
  }

  /**
   * TODO
   * @private
   * @function
   */
  setStatus_(status) {
    if (status !== this.status_) {
      this.element_.classList.remove(this.status_);
      this.status_ = status;
      this.element_.classList.add(this.status_);
      this.element_.style.top = '';
      this.element_.classList.remove('m-no-animation');
      // mobile center
      if (MWindow.WIDTH <= M.config.MOBILE_WIDTH) {
        this.getImpl().centerByStatus(status, this.coord_);
      }
    }
  }

  /**
   * TODO
   * @private
   * @function
   */
  manageTransform(e, html) {
    if (html && html.parentElement) {
      if (e.matches) {
        html.parentElement.classList.add('unsetTransform');
      } else {
        html.parentElement.classList.remove('unsetTransform');
      }
    }
  }

  /**
   * TODO
   * @private
   * @function
   */
  manageCollapsiblePopup_(touchstartY, touchendY) {
    const touchPerc = (touchendY * 100) / MWindow.HEIGHT;
    const distanceTouch = Math.abs(touchstartY - touchendY);
    const distanceTouchPerc = (distanceTouch * 100) / MWindow.HEIGHT;
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
          this.setStatus_(Popup.status.FULL);
        } else if (touchPerc < 85) {
          // 1
          this.setStatus_(Popup.status.DEFAULT);
        } else {
          this.setStatus_(Popup.status.COLLAPSED);
        }
      } else if (this.status_ === Popup.status.DEFAULT) {
        // 1
        if (touchPerc > 45) {
          this.setStatus_(Popup.status.COLLAPSED);
        } else if (touchPerc < 45) {
          // 2
          this.setStatus_(Popup.status.FULL);
        } else {
          this.setStatus_(Popup.status.DEFAULT);
        }
      } else if (this.status_ === Popup.status.FULL) {
        // 1
        if (touchPerc > 45) {
          this.setStatus_(Popup.status.COLLAPSED);
        } else if (touchPerc > 0) {
          // 2
          this.setStatus_(Popup.status.DEFAULT);
        } else {
          this.setStatus_(Popup.status.FULL);
        }
      }
    } else {
      this.setStatus_(this.status_);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  getCoordinate() {
    return this.coord_;
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  setCoordinate(coord) {
    this.coord_ = coord;
    if (!isNullOrEmpty(this.element_)) {
      this.getImpl().show(coord);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  destroy() {
    this.tabs_.length = 0;
    this.coord_ = null;
    this.fire(EventType.DESTROY);
  }
}

/**
 * status of this popup
 * @const
 * @type {object}
 * @public
 * @api
 */
Popup.status = {};

/**
 * collapsed status of this popup
 * @const
 * @type {string}
 * @public
 * @api
 */
Popup.status.COLLAPSED = 'm-collapsed';

/**
 * default status of this popup
 * @const
 * @type {string}
 * @public
 * @api
 */
Popup.status.DEFAULT = 'm-default';

/**
 * full status of this popup
 * @const
 * @type {string}
 * @public
 * @api
 */
Popup.status.FULL = 'm-full';

/**
 * TakeMeThere options
 *
 * @public
 * @api
 * @type {bool}
 */
Popup.options = {
  takeMeThere: false,
  textMode: true,
  msg: 'Llévame allí',
};

export default Popup;
