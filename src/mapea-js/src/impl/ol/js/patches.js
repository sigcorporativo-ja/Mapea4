import * as ModuleLayer from 'ol/layer/Layer';
import OLFormatGML3 from 'ol/format/GML3';
import OLInteractionPointer from 'ol/interaction/Pointer';
import { writeStringTextNode } from 'ol/format/xsd';
import { POINTERUP, POINTERDOWN, POINTERDRAG } from 'ol/MapBrowserEventType';
import { getValues } from 'ol/obj';
/* eslint-disable */
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
ModuleLayer.visibleAtResolution = (layerState, resolution) => {
  return layerState.visible && resolution >= layerState.minResolution &&
    resolution <= layerState.maxResolution;
};

/**
 * @param {Node} node Node.
 * @param {ol.geom.Point} value Point geometry.
 * @param {Array.<*>} objectStack Node stack.
 * @private
 *
 * PATCH: disables axis order configuration
 */
OLFormatGML3.prototype.writePos_ = (node, value, objectStack) => {
  // var context = objectStack[objectStack.length - 1];
  // PATCH: ------------------------------ init
  // var srsName = context['srsName'];
  // var axisOrientation = 'enu';
  // if (srsName) {
  //   axisOrientation = ol.proj.get(srsName).getAxisOrientation();
  // }
  // ------------------------------------- end
  const point = value.getCoordinates();
  const coords = `${point[0]} ${point[1]}`;
  // PATCH: ------------------------------ init
  // only 2d for simple features profile
  // if (axisOrientation.substr(0, 2) === 'en') {
  // ------------------------------------- end
  // PATCH: ------------------------------ init
  // } else {
  //   coords = (point[1] + ' ' + point[0]);
  // }
  // ------------------------------------- end
  writeStringTextNode(node, coords);
};

/**
 * @param {Array.<number>} point Point geometry.
 * @param {string=} optSRSName Optional srsName
 * @return {string} The coords string.
 * @private
 *
 * PATCH: disables axis order configuration
 */
OLFormatGML3.prototype.getCoords_ = (point, optSRSName) => {
  // PATCH: ------------------------------ init
  // var axisOrientation = 'enu';
  // if (optSRSName) {
  //   axisOrientation = ol.proj.get(optSRSName).getAxisOrientation();
  // }
  // return ((axisOrientation.substr(0, 2) === 'en') ?
  //     point[0] + ' ' + point[1] :
  //     point[1] + ' ' + point[0]);
  return `${point[0]} ${point[1]}`;
  // ------------------------------------- end
};

/**
 * TODO Test in IOS11
 */

// /**
//  * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
//  * @return {boolean} Whether the event is a pointerdown, pointerdrag
//  *     or pointerup event.
//  */
// function isPointerDraggingEvent(mapBrowserEvent) {
//   const type = mapBrowserEvent.type;
//   return type === POINTERDOWN ||
//     type === POINTERDRAG ||
//     type === POINTERUP;
// }
//
// /**
//  * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
//  * @private
//  */
// OLInteractionPointer.prototype.updateTrackedPointers_ = (mapBrowserEvent) => {
//   if (isPointerDraggingEvent(mapBrowserEvent)) {
//     const event = mapBrowserEvent.pointerEvent;
//
//     const id = event.pointerId.toString();
//     if (mapBrowserEvent.type === POINTERUP) {
//       delete this.trackedPointers_[id];
//     } else if (mapBrowserEvent.type === POINTERDOWN) {
//       this.trackedPointers_[id] = event;
//     } else if (id in this.trackedPointers_) {
//       // update only when there was a pointerdown event for this pointer
//       this.trackedPointers_[id] = event;
//     }
//     this.targetPointers = getValues(this.trackedPointers_);
//   }
// };
