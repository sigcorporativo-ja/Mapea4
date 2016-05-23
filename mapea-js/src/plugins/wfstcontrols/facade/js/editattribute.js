goog.provide('P.control.EditAttribute');

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
   M.control.EditAttribute = (function (layer) {
      this.name = "editattribute";
      
      if (M.utils.isUndefined(M.impl.control.EditAttribute)) {
         M.exception('La implementación usada no puede crear controles EditAttribute');
      }
      // implementation of this control
      var impl = new M.impl.control.EditAttribute(layer);

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.EditAttribute, M.Control);


   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.EditAttribute.prototype.createView = function (map) {
      this.facadeMap_ = map;
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.template.compile(M.control.EditAttribute.TEMPLATE).then(function (html) {
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
   M.control.EditAttribute.prototype.addEvents = function (html) {
      var button = html.getElementsByTagName('button')['m-button-editattribute'];
      goog.events.listen(button, [goog.events.EventType.CLICK, goog.events.EventType.TOUCHEND],
         function (e) {
            this.activeEditAttribute_();
         }, false, this);
   };
   
   
   /**
    * This function creates the view to the specified map
    * 
    * @public
    * @function
    * @param {M.Map}
    * map to add the control
    * @api stable
    */
   M.control.EditAttribute.prototype.activeEditAttribute_ = function () {
      var controls = this.facadeMap_.getControls();
      for (var i = 0; i < controls.length; i++) {
         if (controls[i].name === "modifyfeature") {
            if (controls[i].getImpl().modify !== null) {
               controls[i].getImpl().modify.setActive(false);
               controls[i].getImpl().select.setActive(false);
               this.facadeMap_.getMapImpl().removeInteraction(controls[i].getImpl().select);
            }
         }
         else if (controls[i].name === "deletefeature") {
            if (controls[i].getImpl().deleteFeature !== null) {
               controls[i].getImpl().deleteFeature.setActive(false);
            }
         }
         else if (controls[i].name === "drawfeature") {
            if (controls[i].getImpl().draw !== null) {
               controls[i].getImpl().draw.setActive(false);
            }
         }
      }

      this.getImpl().activeEdit();
   };


   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.EditAttribute.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.EditAttribute);
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.NAME = 'editattribute';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.TEMPLATE = 'editattribute.html';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.TEMPLATE_POPUP = 'editattribute_popup.html';

})();