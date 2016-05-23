goog.provide('P.control.DrawFeature');

(function () {
   /**
    * @classdesc Main constructor of the class. Creates a GetFeatureInfo
    * control to provides a popup with information about the
    * place where the user has clicked inside the map.
    * 
    * @constructor
    * @param {String}
    * format format response
    * @extends {M.Control}
    * @api stable
    */
   M.control.DrawFeature = (function (layer) {
      this.name = "drawfeature";
      if (M.utils.isUndefined(M.impl.control.DrawFeature)) {
         M.exception('La implementación usada no puede crear controles DrawFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.DrawFeature(layer);

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.DrawFeature, M.Control);

   /**
    * This function creates the view to the specified map
    * 
    * @public
    * @function
    * @param {M.Map}
    * map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.DrawFeature.prototype.createView = function (map) {
      this.facadeMap_ = map;
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.template.compile(M.control.DrawFeature.TEMPLATE).then(
            function (html) {
               this_.addEvents(html);
               success(html);
            });
      });
      return promise;
   };

   /**
    * This function checks if an object is equals to this control
    * 
    * @function
    * @api stable
    */
   M.control.DrawFeature.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.DrawFeature);
      return equals;
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
   M.control.DrawFeature.prototype.addEvents = function (html) {
      var button = html.getElementsByTagName('button')['m-button-drawfeature'];
      goog.events.listen(button, [goog.events.EventType.CLICK,
            goog.events.EventType.TOUCHEND], function (e) {
         this.activeDraw_();
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
   M.control.DrawFeature.prototype.activeDraw_ = function () {
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
         else if (controls[i].name === "editattribute") {
            if (controls[i].getImpl().selectEdit !== null) {
               controls[i].getImpl().selectEdit.setActive(false);
               this.facadeMap_.getMapImpl().removeInteraction(
                     controls[i].getImpl().selectEdit);
               this.facadeMap_.getImpl().removePopup();
            }
         }
      }

      this.getImpl().activeDraw();
   };

   /**
    * Template for this controls - button
    * 
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.NAME = 'drawfeature';

   /**
    * Template for this controls - button
    * 
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.TEMPLATE = 'drawfeature.html';
})();