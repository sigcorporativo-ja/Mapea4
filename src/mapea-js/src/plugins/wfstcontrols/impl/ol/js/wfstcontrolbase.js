/**
 * @namespace M.impl.control
 */
export default class WFSTBase extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class.
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(layer) {
    super();

    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;

    /**
     * Interaction pointer
     * @private
     * @type {ol.interaction.Pointer}
     */
    this.interaction_ = null;

    /**
     * Store modified features
     * @public
     * @type {array}
     * @api stable
     */
    this.modifiedFeatures = [];
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Container control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;

    ol.control.Control.call(this, {
      element,
      target: null,
    });
    map.getMapImpl().addControl(this);
  }

  /**
   * This function activate control
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    if (M.utils.isNullOrEmpty(this.interaction_)) {
      this.createInteraction_();
      this.facadeMap_.getMapImpl().addInteraction(this.interaction_);
      this.interaction_.setActive(true);
    }
    else {
      this.interaction_.setActive(true);
    }
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    if (M.utils.isNullOrEmpty(this.interaction_)) {
      this.createInteraction_();
      this.facadeMap_.getMapImpl().addInteraction(this.interaction_);
      this.interaction_.setActive(false);
    }
    else {
      this.interaction_.setActive(false);
    }
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  createInteraction_() {}

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.layer_ = null;
    this.interaction_ = null;
    this.modifiedFeatures = null;
  }
}
