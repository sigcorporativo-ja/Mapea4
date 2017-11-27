goog.provide('M.Label');

goog.require('M.facade.Base');
goog.require('M.utils');
goog.require('M.exception');
goog.require('goog.dom.classlist');


(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Label
   * control to provides a popup with specified information
   * @constructor
   * @param {string} text - Text to show
   * @param {array} coordOpts - Coordinate to display popup
   * @extends {M.facade.Base}
   * @api stable
   */
  M.Label = (function(text, coordOpts, panMapIfOutOfView) {
    // implementation of this control
    var impl = new M.impl.Label(text, coordOpts, panMapIfOutOfView);
    // calls the super constructor
    goog.base(this, impl);
  });
  goog.inherits(M.Label, M.facade.Base);

  /**
   * This function remove the popup with information
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.Label.prototype.hide = function() {
    this.getImpl().hide();
  };

  /**
   * This function displays the popup with information
   *
   * @public
   * @function
   * @param {M.Map} map - Facade map
   * @api stable
   * @export
   */
  M.Label.prototype.show = function(map) {
    this.getImpl().show(map);
  };

  /**
   * This function return popup created
   *
   * @public
   * @function
   * @returns {M.Popup} popup created
   * @api stable
   * @export
   */
  M.Label.prototype.getPopup = function() {
    return this.getImpl().getPopup();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Label.prototype.getCoordinate = function() {
    return this.getImpl().getCoordinate();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Label.prototype.setCoordinate = function(coord) {
    this.getImpl().setCoordinate(coord);
  };

  /**
   * Template popup for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.Label.POPUP_TEMPLATE = 'label_popup.html';
})();
