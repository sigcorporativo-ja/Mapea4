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
   * @api
   */
  fire(argsParam) {
    let args = argsParam;
    if (!isArray(args)) {
      args = [args];
    }
    this._listener.apply(this._scope, args);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  getEventKey() {
    return this.eventKey_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  isOnce() {
    return this.once_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  has(listener, scope) {
    let has = false;
    if (isFunction(listener)) {
      has = this._listener === listener && this._scope === scope;
    } else {
      has = this.eventKey_ === listener;
    }
    return has;
  }
}

export default EventListener;
