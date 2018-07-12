import Template from "facade/js/util/Template";
import FacadeLabel from "facade/js/Label";
import FacadePopup from "facade/js/Popup";
import Utils from "facade/js/util/Utils";

/**
 * @namespace M.impl.control
 */

export default class Label {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Label
   * control
   * @constructor
   * @param {string} text - Text to show
   * @param {array} coordOpts - Coordinate to display popup
   * @api stable
   */
  constructor(text, coordOpts, panMapIfOutOfView) {
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

    /**
     * Flag to indicate if map does pan or not
     * @private
     * @type {boolean}
     * @api stable
     */
    this.panMapIfOutOfView = panMapIfOutOfView;
  }

  /**
   * This function displays the popup with information
   *
   * @public
   * @function
   * @param {M.Map} map - Map where show popup
   * @api stable
   */
  show(map) {
    this.facadeMap_ = map;
    Template.compile(FacadeLabel.POPUP_TEMPLATE, {
      'jsonp': true,
      'vars': {
        'info': this.text_
      },
      'parseToHtml': false
    }).then(htmlAsText => {
      map.removePopup();
      this.popup_ = new FacadePopup({
        'panMapIfOutOfView': this.panMapIfOutOfView
      });
      this.popup_.addTab({
        'icon': 'g-cartografia-comentarios',
        'title': 'Información',
        'content': htmlAsText,
      });
      map.addPopup(this.popup_, this.coord_);
      // this.popup_.on(M.evt.DESTROY, () => this.facadeMap_.removeLabel());
    });
  }

  /**
   * This function hidden the popup with information
   *
   * @public
   * @function
   * @api stable
   */
  hide() {
    this.facadeMap_.removePopup();
  }

  /**
   * This function return popup created
   *
   * @public
   * @function
   * @returns {M.Popup} popup created
   * @api stable
   */
  getPopup() {
    return this.popup_;
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  getCoordinate() {
    if (Utils.isNullOrEmpty(coord)) {
      coord = this.getPopup().getCoordinate();
    }
    return coord;
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  setCoordinate(coord) {
    let popup = this.getPopup();
    if (!Utils.isNullOrEmpty(popup)) {
      popup.setCoordinate(coord);
    }
  }
}
