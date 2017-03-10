goog.provide('M.impl.Label');

/**
 * @namespace M.impl.control
 */
(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Label
   * control
   * @constructor
   * @param {string} text - Text to show
   * @param {array} coordOpts - Coordinate to display popup
   * @api stable
   */
  M.impl.Label = function (text, coordOpts) {
    /**
     * Text to show
     * @private
     * @type {string}
     */
    this.text_ = text;

    /**
     * Coordinate where to display the popup
     * @private
     * @type {array}
     */
    this.coord_ = [coordOpts.x, coordOpts.y];

    /**
     * Popup to show information
     * @private
     * @type {M.Popup}
     */
    this.popup_ = null;

    /**
     * Map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;
  };

  /**
   * This function displays the popup with information
   *
   * @public
   * @function
   * @param {M.Map} map - Map where show popup
   * @api stable
   */
  M.impl.Label.prototype.show = function (map) {
    this.facadeMap_ = map;
    M.template.compile(M.Label.POPUP_TEMPLATE, {
      'jsonp': true,
      'vars': {
        'info': this.text_
      },
      'parseToHtml': false
    }).then(function (htmlAsText) {
      map.removePopup();
      this.popup_ = new M.Popup();
      this.popup_.addTab({
        'icon': 'g-cartografia-comentarios',
        'title': 'Información',
        'content': htmlAsText
      });
      map.addPopup(this.popup_, this.coord_);
    }.bind(this));
  };

  /**
   * This function hidden the popup with information
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.Label.prototype.hide = function () {
    this.facadeMap_.removePopup();
  };

  /**
   * This function return popup created
   *
   * @public
   * @function
   * @returns {M.Popup} popup created
   * @api stable
   */
  M.impl.Label.prototype.getPopup = function () {
    return this.popup_;
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.impl.Label.prototype.getCoordinate = function () {
    let coord = this.coord_;
    if (M.utils.isNullOrEmpty(coord)) {
      coord = this.getPopup().getCoordinate();
    }
    return coord;
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.impl.Label.prototype.setCoordinate = function (coord) {
    this.coord_ = coord;
    let popup = this.getPopup();
    if (!M.utils.isNullOrEmpty(popup)) {
      popup.setCoordinate(coord);
    }
  };
})();
