/**
 * @module M/Object
 */
import EventsManager from './event/Manager.js';
import { isNullOrEmpty } from './util/Utils.js';

/**
 * @classdesc
 * Main mapea Object. This class creates a Object
 * which manages events
 * @apì
 */
class MObject {
  /**
   * @constructor
   * @api
   */
  constructor() {
    /**
     * Callback for events managed by the
     * facade object
     *
     * @private
     * @type {M.evt.EventsManager}
     */
    this.eventsManager_ = new EventsManager();
  }

  /**
   * Adds event listener
   *
   * @public
   * @function
   * @api
   * @param {M.evt} eventType constant to identify event type
   * @param {function} listener callback function
   * @param {Object} optThis object with aditional options
   */
  on(eventType, listener, optThis) {
    return this.eventsManager_.add(eventType, listener, optThis);
  }

  /**
   * Adds event listener that only once fires
   *
   * @public
   * @function
   * @api
   * @param {M.evt} eventType constant to identify event type
   * @param {function} listener callback function
   * @param {Object} optThis object with aditional options
   */
  once(eventType, listener, optThis) {
    return this.eventsManager_.add(eventType, listener, optThis, true);
  }

  /**
   * Removes event listener
   *
   * @public
   * @function
   * @api
   * @param {M.evt} eventType constant to identify event type
   * @param {function} listener callback function
   * @param {Object} optThis object with aditional options
   */
  un(eventType, listener, optThis) {
    this.eventsManager_.remove(eventType, listener, optThis);
  }

  /**
   * Removes event listener by key
   *
   * @public
   * @function
   * @api
   * @param {M.evt} eventType constant to identify event type
   * @param {String} key event key
   */
  unByKey(eventType, key) {
    this.eventsManager_.remove(eventType, key);
  }

  /**
   * Manual firing an event
   *
   * @public
   * @function
   * @param {M.evt} eventType constant to identify event type
   * @param {Object} argsParam object with aditional options
   */
  fire(eventType, argsParam) {
    let args = argsParam;
    if (isNullOrEmpty(args)) {
      args = [this];
    }
    this.eventsManager_.fire(eventType, args);
  }
}

export default MObject;
