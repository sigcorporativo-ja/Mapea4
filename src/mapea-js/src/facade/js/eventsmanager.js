goog.provide('M.evt.EventsManager');
goog.provide('M.evt.Listener');

(function() {
  'use strict';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_TO_MAP = 'added:map';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_TO_PANEL = 'added:panel';
  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_LAYER = 'added:layer';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_WMC = 'added:wmc';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_KML = 'added:kml';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_WMS = 'added:wms';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_WFS = 'added:wfs';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ADDED_WMTS = 'added:wmts';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.ACTIVATED = 'activated';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.DEACTIVATED = 'deactivated';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.SHOW = 'show';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.HIDE = 'hide';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.DESTROY = 'destroy';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.SELECT_FEATURES = 'select:features';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.UNSELECT_FEATURES = 'unselect:features';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.HOVER_FEATURE = 'hover:feature';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.LEAVE_FEATURE = 'leave:feature';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.LOAD = 'load';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.COMPLETED = 'completed';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.CHANGE = 'change';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.CHANGE_WMC = 'change:wmc';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.CHANGE_PROJ = 'change:proj';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.CLICK = 'click';

  /**
   * Event type
   * @public
   * @type {string}
   * @api stable
   * @expose
   */
  M.evt.MOVE = 'move';

  /**
   * Event type
   * @private
   * @type {array<string>}
   */
  var _eventTypes = [
      M.evt.ADDED_TO_MAP,
      M.evt.ADDED_TO_PANEL,
      M.evt.ADDED_LAYER,
      M.evt.ADDED_WMC,
      M.evt.ADDED_KML,
      M.evt.ADDED_WMS,
      M.evt.ADDED_WFS,
      M.evt.ADDED_WMTS,
      M.evt.ACTIVATED,
      M.evt.DEACTIVATED,
      M.evt.SHOW,
      M.evt.HIDE,
      M.evt.DESTROY,
      M.evt.UNSELECT_FEATURES,
      M.evt.SELECT_FEATURES,
      M.evt.HOVER_FEATURE,
      M.evt.LEAVE_FEATURE,
      M.evt.LOAD,
      M.evt.COMPLETED,
      M.evt.CHANGE,
      M.evt.CHANGE_WMC,
      M.evt.CHANGE_PROJ,
      M.evt.CLICK,
      M.evt.MOVE
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
  M.evt.EventsManager = (function() {
    /**
     * Callback for events managed by the
     * facade object
     *
     * @private
     * @type {Object}
     */
    this.events_ = {};
  });

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  M.evt.EventsManager.prototype.add = function(eventType, listener, optThis) {
    if (!M.utils.isNullOrEmpty(eventType) && (_eventTypes.indexOf(eventType) !== -1) && M.utils.isFunction(listener)) {
      if (M.utils.isNullOrEmpty(this.events_[eventType])) {
        this.events_[eventType] = [];
      }
      if (this.indexOf(eventType, listener, optThis) === -1) {
        var evtListener = new M.evt.Listener(listener, optThis);
        this.events_[eventType].push(evtListener);
      }
    }
  };

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  M.evt.EventsManager.prototype.remove = function(eventType, listener, optThis) {
    var listeners = this.events_[eventType];
    if (!M.utils.isNullOrEmpty(listeners)) {
      var index = this.indexOf(eventType, listener, optThis);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  };

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  M.evt.EventsManager.prototype.fire = function(eventType, args) {
    var evtListeners = this.events_[eventType];
    if (!M.utils.isNullOrEmpty(evtListeners)) {
      evtListeners.forEach(function(evtListener) {
        evtListener.fire(args);
      }, this);
    }
  };

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  M.evt.EventsManager.prototype.indexOf = function(eventType, listener, optThis) {
    var index = -1;
    var evtListeners = this.events_[eventType];
    if (!M.utils.isNullOrEmpty(evtListeners)) {
      for (var i = 0, ilen = evtListeners.length; i < ilen; i++) {
        if (evtListeners[i].has(listener, optThis)) {
          index = i;
          break;
        }
      }
    }
    return index;
  };

  /**
   * @classdesc
   * TODO
   *
   * @constructor
   * @param {Object} impl implementation object
   * @api stable
   */
  M.evt.Listener = (function(listener, scope) {
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
  });

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.evt.Listener.prototype.fire = function(args) {
    if (!M.utils.isArray(args)) {
      args = [args];
    }
    this._listener.apply(this._scope, args);
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.evt.Listener.prototype.has = function(listener, scope) {
    return ((this._listener === listener) && (this._scope === scope));
  };
})();
