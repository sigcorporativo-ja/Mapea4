goog.provide('P.control.ModifyFeature');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a GetFeatureInfo
    * control to provides a popup with information about the place 
    * where the user has clicked inside the map.
    *
    * @constructor
    * @param {String} format format response
    * @extends {M.Control}
    * @api stable
    */
   M.control.ModifyFeature = (function (layer) {
      this.name = "modifyfeature";
      this.modify = null;
      
      if (M.utils.isUndefined(M.impl.control.ModifyFeature)) {
         M.exception('La implementación usada no puede crear controles ModifyFeature');
      }

      // implementation of this control
      var impl = new M.impl.control.ModifyFeature(layer);

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.ModifyFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.ModifyFeature.prototype.createView = function (map) {
      this.facadeMap_ = map;
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.template.compile(M.control.ModifyFeature.TEMPLATE).then(function (html) {
            this_.addEvents(html);
            success(html);
         });
      });
      return promise;
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.ModifyFeature.prototype.addEvents = function (html) {
      var button = html.getElementsByTagName('button')['m-button-modifyfeature'];
      goog.events.listen(button, [goog.events.EventType.CLICK, goog.events.EventType.TOUCHEND],
         function (e) {
            this.activeModify_();
         }, false, this);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.ModifyFeature.prototype.activeModify_ = function(html) {
      var controls = this.facadeMap_.getControls();
      for (var i = 0; i < controls.length; i++) {
         if (controls[i].name === "drawfeature") {
            if (controls[i].getImpl().draw !== null) {
               controls[i].getImpl().draw.setActive(false);
            }
         } else if (controls[i].name === "deletefeature") {
            if (controls[i].getImpl().deleteFeature !== null) {
               controls[i].getImpl().deleteFeature.setActive(false);
            }
         } else if (controls[i].name === "editattribute") {
            if (controls[i].getImpl().selectEdit !== null) {
               controls[i].getImpl().selectEdit.setActive(false);
               this.facadeMap_.getMapImpl().removeInteraction(
                     controls[i].getImpl().selectEdit);
               this.facadeMap_.getImpl().removePopup();
            }
         }
      }

      this.getImpl().activeModify();
   };


   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.ModifyFeature.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.ModifyFeature);
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ModifyFeature.NAME = 'modifyfeature';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ModifyFeature.TEMPLATE = 'modifyfeature.html';
})();