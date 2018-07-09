import Utils from './utils/utils';
import EventListener from './eventlistener'

export default class EventsManager {
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
  constructor() {
    /**
     * Callback for events managed by the
     * facade object
     *
     * @private
     * @type {Object}
     */
    return this.events_ = {};
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  add(eventType, listener, optThis, once = false) {
    if (!Utils.isNullOrEmpty(eventType) && (EventsManager.eventTypes.indexOf(eventType) !== -1) && Utils.isFunction(listener)) {
      if (Utils.isNullOrEmpty(this.events_[eventType])) {
        this.events_[eventType] = [];
      }
      if (this.indexOf(eventType, listener, optThis) === -1) {
        let EventsManagerListener = new EventListener(listener, optThis, once);
        this.events_[eventType].push(EventsManagerListener);
        return EventsManagerListener.eventKey();
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
    let EventsManagerListeners = [].concat(this.events_[eventType]);
    if (!Utils.isNullOrEmpty(EventsManagerListeners)) {
      EventsManagerListeners.forEach(EventsManagerListener => {
        EventsManagerListener.fire(args);
        if (EventsManagerListener.isOnce() === true) {
          this.remove(eventType, EventListener.getEventKey());
        }
      });
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
      for (let i = 0, ilen = evtListeners.length; i < ilen; i++) {
        if (evtListeners[i].has(listener, optThis)) {
          index = i;
          break;
        }
      }
    }
    return index;
  }
}

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_TO_MAP = 'added:map';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_TO_PANEL = 'added:panel';
/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_LAYER = 'added:layer';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_WMC = 'added:wmc';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_KML = 'added:kml';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_WMS = 'added:wms';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_WFS = 'added:wfs';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ADDED_WMTS = 'added:wmts';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.ACTIVATED = 'activated';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.DEACTIVATED = 'deactivated';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.SHOW = 'show';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.HIDE = 'hide';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.DESTROY = 'destroy';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.SELECT_FEATURES = 'select:features';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.UNSELECT_FEATURES = 'unselect:features';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.HOVER_FEATURES = 'hover:features';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.LEAVE_FEATURES = 'leave:features';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.LOAD = 'load';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.COMPLETED = 'completed';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.CHANGE = 'change';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.CHANGE_WMC = 'change:wmc';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.CHANGE_PROJ = 'change:proj';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.CHANGE_STYLE = 'change:style';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.CLICK = 'click';

/**
 * Event type
 * @public
 * @type {string}
 * @api stable
 * @expose
 */
EventsManager.MOVE = 'move';

/**
 * Event type
 * @private
 * @type {array<string>}
 */
EventsManager.eventTypes = [
      EventsManager.ADDED_TO_MAP,
      EventsManager.ADDED_TO_PANEL,
      EventsManager.ADDED_LAYER,
      EventsManager.ADDED_WMC,
      EventsManager.ADDED_KML,
      EventsManager.ADDED_WMS,
      EventsManager.ADDED_WFS,
      EventsManager.ADDED_WMTS,
      EventsManager.ACTIVATED,
      EventsManager.DEACTIVATED,
      EventsManager.SHOW,
      EventsManager.HIDE,
      EventsManager.DESTROY,
      EventsManager.UNSELECT_FEATURES,
      EventsManager.SELECT_FEATURES,
      EventsManager.HOVER_FEATURES,
      EventsManager.LEAVE_FEATURES,
      EventsManager.LOAD,
      EventsManager.COMPLETED,
      EventsManager.CHANGE,
      EventsManager.CHANGE_WMC,
      EventsManager.CHANGE_PROJ,
      EventsManager.CHANGE_STYLE,
      EventsManager.CLICK,
      EventsManager.MOVE
   ];
