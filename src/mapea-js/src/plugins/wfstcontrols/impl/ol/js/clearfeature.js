/**
 * @namespace M.impl.control
 */
export default class ClearFeature extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ClearFeature
   * control
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.impl.Control}
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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {function} element - Template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    super.addTo(map, element);
  }

  /**
   * This function remove unsaved changes
   *
   * @public
   * @function
   * @api stable
   */
  clear() {
    const drawfeatureCtrl = this.facadeMap_.getControls('drawfeature')[0];
    if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
      drawfeatureCtrl.getImpl().modifiedFeatures.length = 0;
      drawfeatureCtrl.deactivate();
    }
    const modifyfeatureCtrl = this.facadeMap_.getControls('modifyfeature')[0];
    if (!M.utils.isNullOrEmpty(modifyfeatureCtrl)) {
      modifyfeatureCtrl.getImpl().modifiedFeatures.length = 0;
      modifyfeatureCtrl.deactivate();
    }
    const deletefeatureCtrl = this.facadeMap_.getControls('deletefeature')[0];
    if (!M.utils.isNullOrEmpty(deletefeatureCtrl)) {
      deletefeatureCtrl.getImpl().modifiedFeatures.length = 0;
      deletefeatureCtrl.deactivate();
    }
    const editattributeCtrl = this.facadeMap_.getControls('editattribute')[0];
    if (!M.utils.isNullOrEmpty(editattributeCtrl)) {
      editattributeCtrl.getImpl().editedFeature = null;
      editattributeCtrl.deactivate();
    }
    this.layer_.getImpl().refresh(true);
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.layer_ = null;
    this.facadeMap_.getMapImpl().removeControl(this);
  }

  /**
   * @public
   * @function
   * @api stable
   */
  setLayer(layer) {
    this.layer_ = layer;
  }
}
