goog.provide('M.impl.patches');

goog.require('ol.layer.Layer');
goog.require('ol.format.WFS');
goog.require('ol.format.GML3');

/**
 * Return `true` if the layer is visible, and if the passed resolution is
 * between the layer's minResolution and maxResolution. The comparison is
 * inclusive for `minResolution` and exclusive for `maxResolution`.
 * @param {ol.layer.LayerState} layerState Layer state.
 * @param {number} resolution Resolution.
 * @return {boolean} The layer is visible at the given resolution.
 *
 * PATCH: inclusive maxResolution comparasion to show layers with the
 * same resolution as its maxResolution
 */
ol.layer.Layer.visibleAtResolution = function (layerState, resolution) {
  return layerState.visible && resolution >= layerState.minResolution &&
    resolution <= layerState.maxResolution;
};

/**
 * This function adds the control to the specified map
 *
 * @private
 * @function
 * @param {M.Map} map to add the plugin
 * @param {function} template template of this control
 *
 * PATCH: waits for the animation ending
 */
ol.control.OverviewMap.prototype.handleToggle_ = function () {
  goog.dom.classlist.toggle(this.element, 'ol-collapsed');
  var button = this.element.querySelector('button');
  goog.dom.classlist.toggle(button, this.openedButtonClass_);
  goog.dom.classlist.toggle(button, this.collapsedButtonClass_);

  setTimeout(function () {
    if (this.collapsed_) {
      ol.dom.replaceNode(this.collapseLabel_, this.label_);
    }
    else {
      ol.dom.replaceNode(this.label_, this.collapseLabel_);
    }
    this.collapsed_ = !this.collapsed_;

    // manage overview map if it had not been rendered before and control
    // is expanded
    var ovmap = this.ovmap_;
    if (!this.collapsed_ && !ovmap.isRendered()) {
      ovmap.updateSize();
      this.resetExtent_();
      ol.events.listenOnce(ovmap, ol.MapEventType.POSTRENDER,
        function (event) {
          this.updateBox_();
        },
        this);
    }
  }.bind(this), this.toggleDelay_);
};
