import { compileSync as compileTemplate } from 'M/util/Template';
import FacadePopup from 'M/Popup';
import { isNullOrEmpty } from 'M/util/Utils';
import labelPopupTemplate from 'templates/label_popup.html';

/**
 * @module M/impl/Label
 */

/**
 * @classdesc
 * Class of Label implementation
 * @api
 */
class Label {
  /**
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
    const htmlAsText = compileTemplate(labelPopupTemplate, {
      vars: {
        info: this.text_,
      },
      parseToHtml: false,
    });
    map.removePopup();
    this.popup_ = new FacadePopup({
      panMapIfOutOfView: this.panMapIfOutOfView,
    });
    this.popup_.addTab({
      icon: 'g-cartografia-comentarios',
      title: 'Información',
      content: htmlAsText,
    });
    map.addPopup(this.popup_, this.coord_);
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
    let coord = this.coord;
    if (isNullOrEmpty(coord)) {
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
    const popup = this.getPopup();
    if (!isNullOrEmpty(popup)) {
      popup.setCoordinate(coord);
    }
  }
}

export default Label;
