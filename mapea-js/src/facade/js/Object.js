/**
 * @module M/Object
 */
import EventsManager from './event/Manager';
import { isNullOrEmpty } from './util/Utils';

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
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  on(eventType, listener, optThis) {
    return this.eventsManager_.add(eventType, listener, optThis);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  once(eventType, listener, optThis) {
    return this.eventsManager_.add(eventType, listener, optThis, true);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  un(eventType, listener, optThis) {
    this.eventsManager_.remove(eventType, listener, optThis);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  unByKey(eventType, key) {
    this.eventsManager_.remove(eventType, key);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
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
