goog.provide('P.impl.control.EditAttribute');

goog.require('goog.events');

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
   M.impl.control.EditAttribute = function (layer) {
      this.selectEdit = null;
      this.layer_ = layer;
   };
   goog.inherits(M.impl.control.EditAttribute, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.EditAttribute.prototype.addTo = function (map, element) {
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
   M.impl.control.EditAttribute.prototype.activeEdit = function () {
      if (this.selectEdit !== null) {
         if (this.selectEdit.getActive() === false) {
            this.selectEdit.setActive(true);
         } else {
            this.facadeMap_.getImpl().removePopup();
            this.selectEdit.setActive(false);
         }
      } else {
         this.edit_();
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
   M.impl.control.EditAttribute.prototype.edit_ = function () {
      var features = new ol.Collection(this.layer_.getImpl().getOL3Layer().getSource().getFeatures());

      var this_ = this;
      this.selectEdit = new ol.interaction.Select();
      this.facadeMap_.getMapImpl().addInteraction(this.selectEdit);
      var eventoClick = "";
      this_.facadeMap_.getMapImpl().on('singleclick', function(event) {
         eventoClick = event;
      }, this_);
      this.selectEdit.getFeatures().on("add", function (feature) {
         var featureSelect = feature;
         this_.editAtt(featureSelect, eventoClick);
      });
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
   M.impl.control.EditAttribute.prototype.editAtt = function (feature, eventoClick) {
      var ob = this;
      var continueSave = true;
      var controls = this.facadeMap_.getControls();
      for (var i = 0; i < controls.length; i++) {
         if (controls[i].name === "drawfeature") {
            if (controls[i].getImpl().draw !== null) {
               if (controls[i].getImpl().newDraw !== null && controls[i].getImpl().newDraw.length > 0) {
                  var newDraw = controls[i].getImpl().newDraw;
                  for (var j = 0; j < newDraw.length; j++) {
                     if (newDraw[j] == feature.element) {
                         alert("Debe guardar el elemento previamente.");
                         continueSave = false;
                     }
                 }
               }
            }
         }
      }
      if(continueSave === true){
         var properties = feature.element.getProperties();
         var templateVar = {
               'properties': []
         };
         for (var p in properties) {
            if(typeof properties[p] === "string" || typeof properties[p] === "number"){
            templateVar.properties.push({
               'key': p,
               'value': properties[p]
            });
         }
         }
      M.template.compile(M.control.EditAttribute.TEMPLATE_POPUP, templateVar).then(function(html) {
         ob.popup_ = new M.impl.Popup(html);
         ob.facadeMap_.getImpl().addPopup(ob.popup_);
         ob.popup_.show(eventoClick.coordinate);
         var button = html.getElementsByTagName('button')['m-button-editattributeSave'];
         
         goog.events.listen(button, [goog.events.EventType.CLICK, goog.events.EventType.TOUCHEND],
            function (e) {
               ob.saveAttributes_(feature);
            }, false, this);
      });
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
   M.impl.control.EditAttribute.prototype.saveAttributes_ = function (feature) {
      var properties = feature.element.getProperties();
      var copyProp = {};
       for (var p in properties){
          var val = properties[p];
          if(typeof val === "string"){
             var id = "idInputText_"+p;
             copyProp[p] = document.getElementById(id).value;
          }
          feature.element.setProperties(copyProp);
      }
       var x = feature.element.getGeometry();
       feature.element.setGeometryName("the_geom");
       feature.element.setGeometry(x);
       
       var controls = this.facadeMap_.getControls();
       for (var i = 0; i < controls.length; i++) {
          if (controls[i].name === "modifyfeature") {
             controls[i].getImpl().newModify.push(feature.element);
             for (var j = 0; j < controls.length; j++) {
                if (controls[j] instanceof  M.control.SaveFeature) {
                   controls[j].getImpl().saveFeature();
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
   M.impl.control.EditAttribute.prototype.destroy = function () {
      this.selectEdit = null;
      this.layer_ = null;
      this.facadeMap_.getImpl().removePopup();
      this.facadeMap_.getMapImpl().removeControl(this);
   };
})();