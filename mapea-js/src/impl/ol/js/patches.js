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
