import Utils from('./utils/utils.js');

export class EventsManager {
  'use strict';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_TO_MAP = 'added:map';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_TO_PANEL = 'added:panel';
  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_LAYER = 'added:layer';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_WMC = 'added:wmc';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_KML = 'added:kml';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_WMS = 'added:wms';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_WFS = 'added:wfs';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ADDED_WMTS = 'added:wmts';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.ACTIVATED = 'activated';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.DEACTIVATED = 'deactivated';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.SHOW = 'show';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.HIDE = 'hide';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.DESTROY = 'destroy';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.SELECT_FEATURES = 'select:features';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.UNSELECT_FEATURES = 'unselect:features';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.HOVER_FEATURES = 'hover:features';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.LEAVE_FEATURES = 'leave:features';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.LOAD = 'load';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.COMPLETED = 'completed';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.CHANGE = 'change';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.CHANGE_WMC = 'change:wmc';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.CHANGE_PROJ = 'change:proj';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.CHANGE_STYLE = 'change:style';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.CLICK = 'click';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  Evt.MOVE = 'move';

  /**
   * Event type
   * @private
   * @type {array<string>}
   */
  var _eventTypes = [
      Evt.ADDED_TO_MAP,
      Evt.ADDED_TO_PANEL,
      Evt.ADDED_LAYER,
      Evt.ADDED_WMC,
      Evt.ADDED_KML,
      Evt.ADDED_WMS,
      Evt.ADDED_WFS,
      Evt.ADDED_WMTS,
      Evt.ACTIVATED,
      Evt.DEACTIVATED,
      Evt.SHOW,
      Evt.HIDE,
      Evt.DESTROY,
      Evt.UNSELECT_FEATURES,
      Evt.SELECT_FEATURES,
      Evt.HOVER_FEATURES,
      Evt.LEAVE_FEATURES,
      Evt.LOAD,
      Evt.COMPLETED,
      Evt.CHANGE,
      Evt.CHANGE_WMC,
      Evt.CHANGE_PROJ,
      Evt.CHANGE_STYLE,
      Evt.CLICK,
      Evt.MOVE
   ];

  /**
   * @classdesc
   * Main facade Object. This class creates a facede
   * Object which has an implementation Object and
   * provides the needed methods to access its implementation
   *
   * @constructor
   * @param {Object} impl implementation object
   * @api stable
   */
  export class EventsManager {
    /**
     * Callback for events managed by the
     * facade object
     *
     * @private
     * @type {Object}
     */
    this.events_ = {};
  });


get eventsManager() {
  return this.events_;
}

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
add(eventType, listener, optThis, once = false) {
  if (!Utils.isNullOrEmpty(eventType) && (_eventTypes.indexOf(eventType) !== -1) && Utils.isFunction(listener)) {
    if (Utils.isNullOrEmpty(this.events_[eventType])) {
      this.events_[eventType] = [];
    }
    if (this.indexOf(eventType, listener, optThis) === -1) {
      let evtListener = new Listener(listener, optThis, once);
      this.events_[eventType].push(evtListener);
      return evtListener.eventKey();
    }
  }
}

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
remove(eventType, listener, optThis) {
  let listeners = this.events_[eventType];
  if (!Utils.isNullOrEmpty(listeners)) {
    let index = this.indexOf(eventType, listener, optThis);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
}

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
fire(eventType, args) {
  let evtListeners = [].concat(this.events_[eventType]);
  if (!Utils.isNullOrEmpty(evtListeners)) {
    evtListeners.forEach(evtListener => {
      evtListener.fire(args);
      if (evtListener.isOnce() === true) {
        this.remove(eventType, evtListener.getEventKey());
      }
    }, this);
  }
}

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
indexOf(eventType, listener, optThis) {
  let index = -1;
  let evtListeners = this.events_[eventType];
  if (!Utils.isNullOrEmpty(evtListeners)) {
    evtListeners.forEach((element, i) => {
      if (evtListeners[i].has(listener, optThis)) {
        index = i;
        break;
      }
    });

  }
}
return index;
}

/**
 * @classdesc
 * TODO
 *
 * @constructor
 * @param {Object} impl implementation object
 * @api stable
 */
export class Lister {
  /**
   * TODO
   *
   * @private
   * @type {function}
   */

  constructor(listener, scope, once = false) {

    this._listener = listener;

    /**
     * TODO
     *
     * @private
     * @type {Object}
     */
    this._scope = scope;

    /**
     * TODO
     */
    this.eventKey_ = Utils.generateRandom();

    /**
     * TODO
     */
    this.once_ = once;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  fire(args) {
    if (!Utils.isArray(args)) {
      args = [args];
    }
    this._listener.apply(this._scope, args);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  get eventKey() {
    return this.eventKey_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  isOnce() {
    return this.once_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  has(listener, scope) {
    let has = false;
    if (Utils.isFunction(listener)) {
      has = this._listener === listener && this._scope === scope;
    } else {
      has = this.eventKey_ === listener;
    }
    return has;
  }
}
