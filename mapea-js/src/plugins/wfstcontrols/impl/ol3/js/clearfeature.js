goog.provide('P.impl.control.ClearFeature');

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
   M.impl.control.ClearFeature = function (layer) {
      this.layer_ = layer;
   };
   
   goog.inherits(M.impl.control.ClearFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.ClearFeature.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;
      goog.base(this, 'addTo', map, element);
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
   M.impl.control.ClearFeature.prototype.clear = function () {
      var controls = this.facadeMap_.getControls();
      for (var i = 0; i < controls.length; i++) {
         if (controls[i].name === "drawfeature") {
               if (controls[i].getImpl().newDraw !== null && controls[i].getImpl().newDraw.length > 0) {
                  for (var x in controls[i].getImpl().newDraw) {
                     if(x !== "remove"){
                        this.layer_.getImpl().getOL3Layer().getSource().removeFeature(controls[i].getImpl().newDraw[x]);
                        controls[i].getImpl().newDraw = [];
                     }
                   }
                 }
            
         }
         if (controls[i].name === "modifyfeature") {
               if (controls[i].getImpl().newModify !== null && controls[i].getImpl().newModify.length > 0) {
                  for (var y in controls[i].getImpl().newModify) {
                     if(y !== "remove"){
                       this.layer_.getImpl().getOL3Layer().getSource().removeFeature(controls[i].getImpl().newModify[y]);
                       controls[i].getImpl().newModify= [];
                     }
                   }
                 }
         }
         if (controls[i].name === "deletefeature") {
               if (controls[i].getImpl().newDeletes !== null && controls[i].getImpl().newDeletes.length > 0) {
                  for (var z in controls[i].getImpl().newDeletes) {
                       this.layer_.getImpl().getOL3Layer().getSource().addFeature(controls[i].getImpl().newDeletes[z]);
                       controls[i].getImpl().newDeletes= [];
                   }
               }
         }
      }
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ClearFeature.prototype.destroy = function () {
      this.layer_ = null;
      this.facadeMap_.getMapImpl().removeControl(this);
   };
})();