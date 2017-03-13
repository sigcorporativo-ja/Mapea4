goog.provide('M.impl.control.OverviewMap');

goog.require('ol.control.OverviewMap');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC selector
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.OverviewMap = function(options) {
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
   M.impl.control.OverviewMap.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;
      var layers = map.getLayers().map(function(layer) {
         return layer.getImpl().getOL3Layer();
      });
      var olProjection = ol.proj.get(map.getProjection().code);
      var resolutions = map.getResolutions();

      ol.control.OverviewMap.call(this, {
         'layers': layers.filter(function(layer) {
            return !M.utils.isNullOrEmpty(layer);
         }),
         'view': new M.impl.View({
            'projection': olProjection,
            'resolutions': resolutions
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
   M.impl.control.OverviewMap.prototype.getElement = function() {
      return this.element;
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
   M.impl.control.OverviewMap.prototype.destroy = function() {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.facadeMap_ = null;
   };
})();