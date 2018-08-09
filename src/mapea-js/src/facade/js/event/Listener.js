/**
 * @module M/evt/Listener
 */
import { isArray, generateRandom, isFunction } from '../util/Utils';

/**
 * @classdesc
 * @api
 */
class EventListener {
  /**
   * @constructor
   * @api
   */
  constructor(listener, scope, once = false) {
    /**
     * TODO
     *
     * @private
     * @type {function}
     */
    this.listener_ = listener;

    /**
     * TODO
     *
     * @private
     * @type {Object}
     */
    this.scope_ = scope;

    /**
     * TODO
     */
    this.eventKey_ = generateRandom();

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
  fire(argsParam) {
    let args = argsParam;
    if (!isArray(args)) {
      args = [args];
    }
    this.listener_.apply(this.scope_, args);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getEventKey() {
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
    if (isFunction(listener)) {
      has = this.listener_ === listener && this.scope_ === scope;
    } else {
      has = this.eventKey_ === listener;
    }
    return has;
  }
}

export default EventListener;
