goog.provide('P.impl.control.DrawFeature');

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
   M.impl.control.DrawFeature = function(layer) {
      this.layer = layer;
      this.draw = null;
      this.newDraw = [];
   };
   goog.inherits(M.impl.control.DrawFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.DrawFeature.prototype.addTo = function(map, element) {
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
   M.impl.control.DrawFeature.prototype.activeDraw = function() {
      if (this.draw !== null) {
         if (this.draw.getActive() === false) {
            this.draw.setActive(true);
         } else {
            this.draw.setActive(false);
         }
      } else {
         this.createInteractionDraw();
      }
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.DrawFeature.prototype.createInteractionDraw = function() {
      var this_ = this;
      this.layer.getImpl().getOL3Layer().setMap(this_.facadeMap_.getImpl().getMapImpl());

      this.draw = new ol.interaction.Draw({
         source : this.layer.getImpl().getOL3Layer().getSource(),
         type :  M.geom.parseWFS(this.layer.geometry)
      });

      this.draw.on('drawend', function(event) {
         var p = event.feature.getGeometry();
         event.feature.setGeometryName("the_geom");
         event.feature.setGeometry(p);
          var features = new ol.Collection(this_.layer.getImpl().getOL3Layer().getSource().getFeatures());
          var feature = features.getArray()[0];
         
          var properties = feature.getProperties();
          var copyProp = {};
           for (var prop in properties){
              var val = properties[prop];
              if(typeof val === "string"){
                 copyProp[prop] = "-";
              }
              else {
                 copyProp[prop] = "0";
              }
              event.feature.setProperties(copyProp);
          }

         this_.newDraw.push(event.feature);
      });
      

      this_.facadeMap_.getMapImpl().addInteraction(this.draw);
      this.draw.setActive(true);
   };
   

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.DrawFeature.prototype.destroy = function() {
      this.layer = null;
      this.draw = null;
      this.facadeMap_.getMapImpl().removeControl(this);
   };
})();