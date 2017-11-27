goog.provide('M.impl.control.OverviewMap');

goog.require('ol.control.OverviewMap');

/**
 * @namespace M.impl.control
 */
(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  M.impl.control.OverviewMap = function (options) {
    /**
     * @private
     * @type {number}
     * @expose
     */
    this.toggleDelay_ = 0;
    if (!M.utils.isNullOrEmpty(options.toggleDelay)) {
      this.toggleDelay_ = options.toggleDelay;
    }

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.collapsedButtonClass_ = 'g-cartografia-mundo';
    if (!M.utils.isNullOrEmpty(options.collapsedButtonClass)) {
      this.collapsedButtonClass_ = options.collapsedButtonClass;
    }

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.openedButtonClass_ = 'g-cartografia-flecha-derecha2';
    if (!M.utils.isNullOrEmpty(options.openedButtonClass)) {
      this.openedButtonClass_ = options.openedButtonClass;
    }
    this.facadeMap_ = null;
  };
  goog.inherits(M.impl.control.OverviewMap, ol.control.OverviewMap);

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  M.impl.control.OverviewMap.prototype.addTo = function (map, element) {
    this.facadeMap_ = map;
    let olLayers = [];
    map.getLayers().forEach(layer => {
      let olLayer = layer.getImpl().getOL3Layer();
      if (M.utils.isNullOrEmpty(olLayer)) {
        layer.getImpl().on(M.evt.ADDED_TO_MAP, this.addLayer_, this);
      }
      else {
        olLayers.push(olLayer);
      }
    }, this);

    ol.control.OverviewMap.call(this, {
      'layers': olLayers,
      'view': new M.impl.View({
        'projection': ol.proj.get(map.getProjection().code),
        'resolutions': map.getResolutions()
      })
    });

    var button = this.element.querySelector('button');
    if (this.collapsed_ === true) {
      goog.dom.classlist.toggle(button, this.collapsedButtonClass_);
    }
    else {
      goog.dom.classlist.toggle(button, this.openedButtonClass_);
    }
    map.getMapImpl().addControl(this);
  };

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.control.OverviewMap.prototype.getElement = function () {
    return this.element;
  };

  /**
   * function remove the event 'click'
   *
   * @private
   * @function
   */
  M.impl.control.OverviewMap.prototype.addLayer_ = function (layer) {
    console.log(layer);
    layer.un(M.evt.ADDED_TO_MAP, this.addLayer_, this);
    this.getOverviewMap().addLayer(layer.getOL3Layer());
  };


  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.control.OverviewMap.prototype.destroy = function () {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  };
})();
