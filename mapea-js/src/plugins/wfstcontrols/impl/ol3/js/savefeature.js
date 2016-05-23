goog.provide('P.impl.control.SaveFeature');

goog.require('goog.dom.xml');

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
   M.impl.control.SaveFeature = function (layer) {
      this.layer = layer;
   };
   goog.inherits(M.impl.control.SaveFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.SaveFeature.prototype.addTo = function (map, element) {
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
   M.impl.control.SaveFeature.prototype.saveFeature = function () {
      var this_ = this;
      var formatWFS = new ol.format.WFS();
      var newDraw = null;
      var newDeletes = null;
      var newModify = null;
      var controls = this.facadeMap_.getControls();
      var j;
      for (var i = 0; i < controls.length; i++) {
         if (controls[i].name === "drawfeature") {
            if (controls[i].getImpl().draw !== null) {
               if (controls[i].getImpl().newDraw !== null && controls[i].getImpl().newDraw.length > 0) {
                  newDraw = controls[i].getImpl().newDraw;
                  controls[i].getImpl().newDraw = [];
               }
            }
         }
         else if (controls[i].name === "deletefeature") {
            if (controls[i].getImpl().newDeletes !== null) {
               if (controls[i].getImpl().newDeletes !== null && controls[i].getImpl().newDeletes.length > 0) {
                  for (j = 0; j < controls[i].getImpl().newDeletes.length; j++) {
                     var p = controls[i].getImpl().newDeletes[j].getGeometry();
                     controls[i].getImpl().newDeletes[j].setGeometryName("the_geom");
                     controls[i].getImpl().newDeletes[j].setGeometry(p);
                  }
                  newDeletes = controls[i].getImpl().newDeletes;
                  controls[i].getImpl().newDeletes = [];
               }
            }
         }
         else if (controls[i].name === "modifyfeature") {
            if (controls[i].getImpl().modifyfeature !== null) {
               if (controls[i].getImpl().newModify !== null && controls[i].getImpl().newModify.length > 0) {

                  for (j = 0; j < controls[i].getImpl().newModify.length; j++) {
                     controls[i].getImpl().newModify[j].set("geometry", undefined);
                  }

                  newModify = controls[i].getImpl().newModify;
                  controls[i].getImpl().newModify = [];
               }
            }
         }
      }
      
         var wfstRequestXml = formatWFS.writeTransaction(newDraw, newModify, newDeletes, {
            featureNS: 'www.callejero.es',
            featurePrefix: 'feature',
            featureType: this.layer.name
         });
            
         var wfstRequest = goog.dom.xml.serialize(wfstRequestXml);
         
         M.remote.post(this.layer.url, wfstRequest).then(function(result) {
            console.debug(result);
         });
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.SaveFeature.prototype.destroy = function () {
      this.layer = null;
      this.facadeMap_.getMapImpl().removeControl(this);
   };
})();