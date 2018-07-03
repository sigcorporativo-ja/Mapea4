import Utils from './utils/utils';

export default class EventListener {
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
    if (Utils.isFunction(listener)) {
      has = this._listener === listener && this._scope === scope;
    } else {
      has = this.eventKey_ === listener;
    }
    return has;
  }
}
