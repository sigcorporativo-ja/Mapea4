import EventsManager from('./events/eventsmanager.js');
import EventListener from('./events/eventlistener.js');
import Utils from('./utils/utils.js');

class Object {
  /**
  * @classdesc
  * Main mapea Object. This class creates a Object
  * which manages events
  *
  * @constructor
  * @api stable
  */
  constructor() {
    /**
     * Callback for events managed by the
     * facade object
     *
     * @private
     * @type {M.evt.EventsManager}
     */
    this.eventsManager_ = new EvtListener();
  }


  // TODO
  get eventsManager() {
    return this.eventsManager_;
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  on(eventType, listener, optThis) {
    return this.eventsManager.add(eventType, listener, optThis);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  once(eventType, listener, optThis) {
    return this.eventsManager.add(eventType, listener, optThis, true);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  once(eventType, listener, optThis) {
    return this.eventsManager.add(eventType, listener, optThis, true);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  un(eventType, listener, optThis) {
    this.eventsManager.remove(eventType, listener, optThis);
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  fire(eventType, args) {
    if (Utils.isNullOrEmpty(args)) {
      args = [this];
    }
    this.eventsManager.fire(eventType, args);
  }
}
