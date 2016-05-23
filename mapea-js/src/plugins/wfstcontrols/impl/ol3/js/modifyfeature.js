goog.provide('P.impl.control.ModifyFeature');


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
   M.impl.control.ModifyFeature = function (layer) {
      this.layer_ = layer;
      this.modify = null;
      this.select =  null;
      this.newModify = [];
   };
   goog.inherits(M.impl.control.ModifyFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;
      goog.base(this, 'addTo', map, element);
   };
   
   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.activeModify = function() {
      if (this.modify !== null) {
         if(this.modify.getActive() === false){
         this.modify.setActive(true);
         }else{
            this.modify.setActive(false);
            this.select.setActive(false);
         }
      }else{
         this.createInteractionModify_();
      }
   };
   
   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.createInteractionModify_ = function() {
      
      var features = new ol.Collection(this.layer_.getImpl().getOL3Layer().getSource().getFeatures());
      
      var this_ = this;
      this.select = new ol.interaction.Select();
      this.facadeMap_.getMapImpl().addInteraction(this.select);
      this.select.getFeatures().on("add", function (event) {
        
         var p = event.element.getGeometry();
         event.element.setGeometryName("the_geom");
         event.element.setGeometry(p);
            
         this_.modificar_(event);
         this_.mofidy = "";
      });
   };
   
   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.modificar_ = function(evento) {
      var this_ = this;
      var arrayFeature =  evento.target.getArray();
      var feature = new ol.Collection(evento.target.getArray());
      this.modify = new ol.interaction.Modify({
         features : feature,
         deleteCondition : function(event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
         }
      });
      this.facadeMap_.getMapImpl().addInteraction(this.modify);
      this.modify.setActive(true);
      
      this.modify.on("modifyend", function() {
         this_.newModify.push(arrayFeature[0]);
      }, this);
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.destroy = function () {
       this.facadeMap_.getMapImpl().removeControl(this);
       this.layer_ = null;
       this.modify = null;
       this.select =  null;
       this.newModify = [];
   };
})();