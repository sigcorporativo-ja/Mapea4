goog.provide('P.plugin.WFSTControls');

goog.require('P.control.DrawFeature');
goog.require('P.control.ModifyFeature');
goog.require('P.control.DeleteFeature');
goog.require('P.control.ClearFeature');
goog.require('P.control.SaveFeature');
goog.require('P.control.EditAttribute');

goog.require('goog.events');

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {Object} impl implementation object
 * @api stable
 */
M.plugin.WFSTControls = (function(controls) {

   this.controls = controls;

   /**
    * Facade of the map
    * @private
    * @type {M.Map}
    */
   this.map_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.drawfeature_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.modifyfeature_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.deletefeature_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.clearfeature_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.savefeature_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.editattibute_ = null;

   goog.base(this);
});
goog.inherits(M.plugin.WFSTControls, M.Plugin);

/**
 * This function provides the implementation
 * of the object
 *
 * @public
 * @function
 * @param {Object} map the map to add the plugin
 * @api stable
 */
M.plugin.WFSTControls.prototype.addTo = function(map) {
   this.map_ = map;
   var wfslayer = map.getWFS()[0];

   if (M.utils.isNullOrEmpty(wfslayer)) {
      M.dialog.error('Los controles <b>' + this.controls.join(',') + '</b> no se pueden añadir al mapa porque no existe una capa WFS cargada.');
   }
   else {
      var addSave = false;
      var addClear = false;
      for (var i = 0, ilen = this.controls.length; i < ilen; i++) {
         if (this.controls[i] === "drawfeature") {
            this.drawfeature_ = new M.control.DrawFeature(wfslayer);
            map.addControls([this.drawfeature_]);
            addSave = true;
            addClear = true;
         }
         else if (this.controls[i] === "modifyfeature") {
            this.modifyfeature_ = new M.control.ModifyFeature(wfslayer);
            map.addControls([this.modifyfeature_]);
            addSave = true;
            addClear = true;
         }
         else if (this.controls[i] === "deletefeature") {
            this.deletefeature_ = new M.control.DeleteFeature(wfslayer);
            map.addControls([this.deletefeature_]);
            addSave = true;
            addClear = true;
         }
         else if (this.controls[i] === "editattribute") {
            this.editattibute_ = new M.control.EditAttribute(wfslayer);
            map.addControls([this.editattibute_]);
            addClear = true;
         }
      }

      if (addSave) {
         this.savefeature_ = new M.control.SaveFeature(wfslayer);
         map.addControls([this.savefeature_]);
      }
      if (addClear) {
         this.clearfeature_ = new M.control.ClearFeature(wfslayer);
         map.addControls([this.clearfeature_]);
      }
   }
};

/**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
M.plugin.WFSTControls.prototype.destroy = function() {
   this.map_.removeControls([
      this.drawfeature_,
      this.modifyfeature_,
      this.deletefeature_,
      this.clearfeature_,
      this.savefeature_,
      this.editattibute_
   ]);
   this.controls = null;
   this.map_ = null;
   this.drawfeature_ = null;
   this.modifyfeature_ = null;
   this.deletefeature_ = null;
   this.clearfeature_ = null;
   this.savefeature_ = null;
   this.editattibute_ = null;
};