goog.provide('P.impl.control.Measure');

goog.require('goog.events');
goog.require('goog.dom.classes');

/**
 * @classdesc
 * Main constructor of the measure control.
 *
 * @constructor
 * @param {string} type - Type of the measure geometry
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.Measure = function(type) {
   /**
    * Type of the measure geometry
    * @private
    * @type {string}
    */
   this.type_ = type;

   /**
    * Vector layer to draw the measures
    * @private
    * @type {ol.layer.Vector}
    */
   this.layer_ = this.createLayer_();

   /**
    * Map interaction
    * @private
    * @type {ol.interaction.Draw}
    */
   this.draw_ = this.createIteractionDraw_();

   /**
    * Overlay to show the help messages
    * @private
    * @type {ol.Overlay}
    */
   this.helpTooltip_ = null;

   /**
    * The measure tooltip element
    * @private
    * @type {ol.Overlay}
    */
   this.measureTooltip_ = null;

   /**
    * Facade of the map
    * @private
    * @type {M.Map}
    */
   this.facadeMap_ = null;

   /**
    * Currently drawn feature.
    * @private
    * @type {ol.Feature}
    */
   this.currentFeature_ = null;

   /**
    * Currently drawn feature coordinate.
    * @private
    * @type {ol.Coordinate}
    */
   this.tooltipCoord_ = null;

   /**
    * Currently drawn feature coordinate.
    * @private
    * @type {array<ol.Overlay>}
    */
   this.overlays_ = [];

   goog.base(this);
};
goog.inherits(M.impl.control.Measure, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map - Map to add the plugin
 * @param {HTMLElement} element - template of this control
 * @api stable
 */
M.impl.control.Measure.prototype.addTo = function(map, element) {
   this.facadeMap_ = map;

   // adds layer
   map.getMapImpl().addLayer(this.layer_);

   // super addTo
   goog.base(this, 'addTo', map, element);

   this.createHelpTooltip_();
   this.createMeasureTooltip_();
};

/**
 * This function enables plugin pressed
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.Measure.prototype.activate = function() {
   // if it is measure length then deactivate measure area
   if (this instanceof M.impl.control.MeasureLength) {
      var measureArea = this.facadeMap_.getControls().filter(function(control) {
         return (control instanceof M.control.MeasureArea);
      })[0];
      measureArea.deactivate();
   }
   // if it is measure area then deactivate measure length
   else if (this instanceof M.impl.control.MeasureArea) {
      var measureLength = this.facadeMap_.getControls().filter(function(control) {
         return (control instanceof M.control.MeasureLength);
      })[0];
      measureLength.deactivate();
   }
   this.createHelpTooltip_().then(function() {
      this.facadeMap_.getMapImpl().on('pointermove', this.pointerMoveHandler_, this);
      this.facadeMap_.getMapImpl().addInteraction(this.draw_);
      this.active = true;
   }.bind(this));
   this.createMeasureTooltip_();
};

/**
 * This function dissable plugin
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.Measure.prototype.deactivate = function() {
   this.facadeMap_.getMapImpl().un('pointermove', this.pointerMoveHandler_, this);
   this.facadeMap_.getMapImpl().removeInteraction(this.draw_);
   this.clear();
   if (!M.utils.isNullOrEmpty(this.helpTooltip_)) {
      this.facadeMap_.getMapImpl().removeOverlay(this.helpTooltip_);
   }
   if (!M.utils.isNullOrEmpty(this.measureTooltip_)) {
      this.facadeMap_.getMapImpl().removeOverlay(this.measureTooltip_);
   }
   this.active = false;
};

/**
 * This function create vector layer to draw the measures
 *
 * @function
 * @private
 * @return {ol.layer.Vector} layer - Vector layer
 */
M.impl.control.Measure.prototype.createLayer_ = function() {
   var layer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
         fill: new ol.style.Fill({
            color: 'rgba(51, 124, 235, 0.2)'
         }),
         stroke: new ol.style.Stroke({
            color: '#337ceb',
            width: 2
         }),
         image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
               color: '#337ceb'
            })
         })
      }),
      zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 99
   });
   return layer;
};

/**
 * This function create interaction draw
 *
 * @private
 * @function
 * @return {ol.interaction.Draw} draw - Interaction draw
 */
M.impl.control.Measure.prototype.createIteractionDraw_ = function() {
   var draw = new ol.interaction.Draw({
      source: this.layer_.getSource(),
      type: this.type_,
      style: new ol.style.Style({
         fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
         }),
         stroke: new ol.style.Stroke({
            color: '#b54d01',
            lineDash: [10, 10],
            width: 2
         }),
         image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
               color: '#b54d01'
            }),
            fill: new ol.style.Fill({
               color: 'rgba(255, 255, 255, 0.5)'
            })
         })
      })
   });
   draw.on('drawstart', this.onDrawStart_, this);
   draw.on('drawend', this.onDrawEnd_, this);

   return draw;
};

/**
 * This function create tooltip with the help
 *
 * @private
 * @function
 * @return {Promise} Template tooltip
 */
M.impl.control.Measure.prototype.createHelpTooltip_ = function() {
   var this_ = this;
   return M.template.compile(M.control.Measure.POINTER_TOOLTIP_TEMPLATE, {
      'jsonp': true
   }).then(function(helpTooltipElement) {
      this_.helpTooltip_ = new ol.Overlay({
         element: helpTooltipElement,
         offset: [15, 0],
         positioning: 'center-left'
      });
      this_.facadeMap_.getMapImpl().addOverlay(this_.helpTooltip_);
   });
};

/**
 * This function create Measure tooltip
 *
 * @private
 * @function
 */
M.impl.control.Measure.prototype.createMeasureTooltip_ = function() {
   var this_ = this;
   M.template.compile(M.control.Measure.MEASURE_TOOLTIP_TEMPLATE, {
      'jsonp': true
   }).then(function(measureTooltipElement) {
      if (!M.utils.isNullOrEmpty(this_.measureTooltip_)) {
         this_.overlays_.push(this_.measureTooltip_);
      }
      this_.measureTooltip_ = new ol.Overlay({
         element: measureTooltipElement,
         offset: [0, -15],
         positioning: 'bottom-center'
      });
      this_.facadeMap_.getMapImpl().addOverlay(this_.measureTooltip_);
   });
};

/**
 * This function allows start to draw
 * @private
 * @function
 * @param {goog.events.Event} evt - Event draw start
 */
M.impl.control.Measure.prototype.onDrawStart_ = function(evt) {
   this.currentFeature_ = evt.feature;
   this.tooltipCoord_ = evt.coordinate;
   this.currentFeature_.getGeometry().on('change', this.onGeometryChange_, this);
};

/**
 * This function allows end to draw
 *
 * @private
 * @function
 * @param {goog.events.Event} evt - Event draw end
 */
M.impl.control.Measure.prototype.onDrawEnd_ = function(evt) {
   this.currentFeature_.getGeometry().un('change', this.onGeometryChange_);

   // unset sketch
   this.currentFeature_ = null;
   goog.dom.classes.add(this.measureTooltip_.getElement(), 'static');
   this.measureTooltip_.setOffset([0, -7]);

   this.createMeasureTooltip_();
};

/**
 * Handle pointer move.
 *
 * private
 * function
 * @param {ol.MapBrowserEvent} evt - Event pointer move
 */
M.impl.control.Measure.prototype.pointerMoveHandler_ = function(evt) {
   if (evt.dragging) {
      return;
   }
   var helpMsg = this.helpMsg_;
   if (this.currentFeature_) {
      helpMsg = this.helpMsgContinue_;
   }
   if (!M.utils.isNullOrEmpty(this.helpTooltip_)) {
      this.helpTooltip_.getElement().innerHTML = helpMsg;
      this.helpTooltip_.setPosition(evt.coordinate);
   }
};

/**
 * Handle pointer move.
 * private
 * function
 * @param {ol.MapBrowserEvent} evt - Event pointer change
 */
M.impl.control.Measure.prototype.onGeometryChange_ = function(evt) {
   var newGeometry = evt.target;
   var tooltipText = this.formatGeometry(newGeometry);
   var tooltipCoord = this.getTooltipCoordinate(newGeometry);

   if (!M.utils.isNullOrEmpty(this.measureTooltip_)) {
      this.measureTooltip_.getElement().innerHTML = tooltipText;
      this.measureTooltip_.setPosition(tooltipCoord);
   }
};

/**
 * Clear all measures
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.Measure.prototype.clear = function() {
   if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.layer_.getSource().clear();
   }
   this.overlays_.forEach(function(overlay) {
      this.facadeMap_.getMapImpl().removeOverlay(overlay);
   }, this);
   this.overlays_.length = 0;
};

/**
 * This function destroys this control and cleaning the HTML
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.Measure.prototype.destroy = function() {
   this.facadeMap_.removeControls(this);
   this.facadeMap_ = null;
   this.overlays_.length = 0;
};