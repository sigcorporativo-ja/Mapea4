/**
 * @module M/evt/EventsManager
 */
import { isNullOrEmpty, isFunction } from '../util/Utils';
import EventListener from './Listener';
import * as EventType from './eventtype';

/**
 * @classdesc
 * Main facade Object. This class creates a facede
 * Object which has an implementation Object and
 * provides the needed methods to access its implementation
 * @api
 */
class EventsManager {
  /**
   * @constructor
   * @param {Object} impl implementation object
   * @api
   */
  constructor() {
    /**
     * Callback for events managed by the
     * facade object
     *
     * @private
     * @type {Object}
     */
    this.events_ = {};
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  add(eventType, listener, optThis, once = false) {
    let eventTypes = Object.values(EventType);
    let eventKey;
    if (!isNullOrEmpty(eventType) &&
      (eventTypes.indexOf(eventType) !== -1) && isFunction(listener)) {
      if (isNullOrEmpty(this.events_[eventType])) {
        this.events_[eventType] = [];
      }
      if (this.indexOf(eventType, listener, optThis) === -1) {
        const EventsManagerListener = new EventListener(listener, optThis, once);
        this.events_[eventType].push(EventsManagerListener);
        eventKey = EventsManagerListener.getEventKey();
      }
    }
    return eventKey;
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  remove(eventType, listener, optThis) {
    const listeners = this.events_[eventType];
    if (!isNullOrEmpty(listeners)) {
      const index = this.indexOf(eventType, listener, optThis);
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
   * @api
   */
  fire(eventType, args) {
    const EventsManagerListeners = [].concat(this.events_[eventType]);
    if (!isNullOrEmpty(EventsManagerListeners)) {
      EventsManagerListeners.forEach((EventManagerListener) => {
        EventManagerListener.fire(args);
        if (EventManagerListener.isOnce() === true) {
          this.remove(eventType, EventManagerListener.getEventKey());
        }
      });
    }
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  indexOf(eventType, listener, optThis) {
    let index = -1;
    const evtListeners = this.events_[eventType];
    if (!isNullOrEmpty(evtListeners)) {
      for (let i = 0, ilen = evtListeners.length; i < ilen; i += 1) {
        if (evtListeners[i].has(listener, optThis)) {
          index = i;
          break;
        }
      }
    }
    return index;
  }
}

export default EventsManager;
