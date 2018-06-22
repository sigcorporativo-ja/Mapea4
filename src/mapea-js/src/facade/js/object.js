import EventsManager from('./eventsmanager.js');
import EvtListener from('./eventsmanager.js');
import Utils from('./utils/utils.js');

/**
 * @classdesc
 * Main mapea Object. This class creates a Object
 * which manages events
 *
 * @constructor
 * @api stable
 */
class Object {

  /**
   * Callback for events managed by the
   * facade object
   *
   * @private
   * @type {M.evt.EventsManager}
   */
  this.eventsManager = new EvtListener();
});

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
on(eventType, listener, optThis) {
  return this.eventsManager.add(eventType, listener, optThis);
};

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
once(eventType, listener, optThis) {
  return this.eventsManager.add(eventType, listener, optThis, true);
};

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
once(eventType, listener, optThis) {
  return this.eventsManager.add(eventType, listener, optThis, true);
};

/**
 * Sets the callback when the instace is loaded
 *
 * @public
 * @function
 * @api stable
 */
un(eventType, listener, optThis) {
  this.eventsManager.remove(eventType, listener, optThis);
};

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
};
