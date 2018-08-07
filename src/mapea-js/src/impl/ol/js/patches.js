import * as ModuleLayer from 'ol/layer/Layer';
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

// /**
//  * @param {Node} node Node.
//  * @param {ol.geom.Point} value Point geometry.
//  * @param {Array.<*>} objectStack Node stack.
//  * @private
//  *
//  * PATCH: disables axis order configuration
//  */
// ol.format.GML3.prototype.writePos_ = function(node, value, objectStack) {
//   // var context = objectStack[objectStack.length - 1];
//   // PATCH: ------------------------------ init
//   // var srsName = context['srsName'];
//   // var axisOrientation = 'enu';
//   // if (srsName) {
//   //   axisOrientation = ol.proj.get(srsName).getAxisOrientation();
//   // }
//   // ------------------------------------- end
//   var point = value.getCoordinates();
//   var coords;
//   // PATCH: ------------------------------ init
//   // only 2d for simple features profile
//   // if (axisOrientation.substr(0, 2) === 'en') {
//   // ------------------------------------- end
//   coords = (point[0] + ' ' + point[1]);
//   // PATCH: ------------------------------ init
//   // } else {
//   //   coords = (point[1] + ' ' + point[0]);
//   // }
//   // ------------------------------------- end
//   ol.format.XSD.writeStringTextNode(node, coords);
// };
//
// /**
//  * @param {Array.<number>} point Point geometry.
//  * @param {string=} opt_srsName Optional srsName
//  * @return {string} The coords string.
//  * @private
//  *
//  * PATCH: disables axis order configuration
//  */
// ol.format.GML3.prototype.getCoords_ = function(point, opt_srsName) {
//   // PATCH: ------------------------------ init
//   // var axisOrientation = 'enu';
//   // if (opt_srsName) {
//   //   axisOrientation = ol.proj.get(opt_srsName).getAxisOrientation();
//   // }
//   // return ((axisOrientation.substr(0, 2) === 'en') ?
//   //     point[0] + ' ' + point[1] :
//   //     point[1] + ' ' + point[0]);
//   return (point[0] + ' ' + point[1]);
//   // ------------------------------------- end
// };
//
// /**
//  * This function adds the control to the specified map
//  *
//  * @private
//  * @function
//  * @param {M.Map} map to add the plugin
//  * @param {function} template template of this control
//  *
//  * PATCH: waits for the animation ending
//  */
// ol.control.OverviewMap.prototype.handleToggle_ = function() {
//   goog.dom.classList.toggle(this.element, 'ol-collapsed');
//   var button = this.element.querySelector('button');
//   goog.dom.classList.toggle(button, this.openedButtonClass_);
//   goog.dom.classList.toggle(button, this.collapsedButtonClass_);
//
//   setTimeout(function() {
//     if (this.collapsed_) {
//       ol.dom.replaceNode(this.collapseLabel_, this.label_);
//     } else {
//       ol.dom.replaceNode(this.label_, this.collapseLabel_);
//     }
//     this.collapsed_ = !this.collapsed_;
//
//     // manage overview map if it had not been rendered before and control
//     // is expanded
//     var ovmap = this.ovmap_;
//     if (!this.collapsed_ && !ovmap.isRendered()) {
//       ovmap.updateSize();
//       this.resetExtent_();
//       ol.events.listenOnce(ovmap, ol.MapEventType.POSTRENDER,
//         function(event) {
//           this.updateBox_();
//         },
//         this);
//     }
//   }.bind(this), this.toggleDelay_);
// };
//
// /**
//  * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
//  * @private
//  */
// ol.interaction.Pointer.prototype.updateTrackedPointers_ = function(mapBrowserEvent) {
//   if (this.isPointerDraggingEvent_(mapBrowserEvent)) {
//     var event = mapBrowserEvent.pointerEvent;
//
//     var id = event.pointerId.toString();
//     if (mapBrowserEvent.type == ol.MapBrowserEventType.POINTERUP) {
//       delete this.trackedPointers_[id];
//     } else if (mapBrowserEvent.type ==
//       ol.MapBrowserEventType.POINTERDOWN) {
//       this.trackedPointers_[id] = event;
//     } else if (id in this.trackedPointers_) {
//       // update only when there was a pointerdown event for this pointer
//       this.trackedPointers_[id] = event;
//     }
//     this.targetPointers = ol.obj.getValues(this.trackedPointers_);
//   }
// };
//
// /**
//  * @private
//  * @param {ol.render.ReplayGroup} replayGroup Replay group.
//  * @param {ol.geom.Circle} geometry Geometry.
//  * @param {ol.style.Style} style Style.
//  * @param {ol.Feature} feature Feature.
//  */
// M.impl.patches.renderPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
//   if (style instanceof M.impl.style.CentroidStyle && style.getImage() != null) {
//     M.impl.patches.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
//   } else {
//     ol.renderer.vector.renderPolygonGeometry_(replayGroup, geometry, style, feature);
//   }
// };
//
// /**
//  * @private
//  * @param {ol.render.ReplayGroup} replayGroup Replay group.
//  * @param {ol.geom.Circle} geometry Geometry.
//  * @param {ol.style.Style} style Style.
//  * @param {ol.Feature} feature Feature.
//  */
// M.impl.patches.renderMultiPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
//   if (style instanceof M.impl.style.CentroidStyle && style.getImage() != null) {
//     M.impl.patches.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
//   } else {
//     ol.renderer.vector.renderMultiPolygonGeometry_(replayGroup, geometry, style, feature);
//   }
// };
//
// /**
//  * @private
//  * @param {ol.render.ReplayGroup} replayGroup Replay group.
//  * @param {ol.geom.Circle} geometry Geometry.
//  * @param {ol.style.Style} style Style.
//  * @param {ol.Feature} feature Feature.
//  */
// M.impl.patches.renderLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
//   if (style instanceof M.impl.style.CentroidStyle && style.getImage() != null) {
//     M.impl.patches.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
//   } else {
//     ol.renderer.vector.renderLineStringGeometry_(replayGroup, geometry, style, feature);
//   }
// };
//
// /**
//  * @private
//  * @param {ol.render.ReplayGroup} replayGroup Replay group.
//  * @param {ol.geom.Circle} geometry Geometry.
//  * @param {ol.style.Style} style Style.
//  * @param {ol.Feature} feature Feature.
//  */
// M.impl.patches.renderMultiLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
//   if (style instanceof M.impl.style.CentroidStyle && style.getImage() != null) {
//     M.impl.patches.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
//   } else {
//     ol.renderer.vector.renderMultiLineStringGeometry_(replayGroup, geometry, style, feature);
//   }
// };
//
// /**
//  * @private
//  * @param {ol.render.ReplayGroup} replayGroup Replay group.
//  * @param {ol.geom.Circle} geometry Geometry.
//  * @param {ol.style.Style} style Style.
//  * @param {ol.Feature} feature Feature.
//  */
// M.impl.patches.drawGeometryCentroidAsFeature = function(replayGroup, geometry, style, feature) {
//   let parser = new jsts.io.OL3Parser();
//   let jstsGeom = parser.read(feature.getGeometry());
//   let centroid = Object.values(jstsGeom.getCentroid().getCoordinates()[0]).filter(c => c != undefined);
//   // let centroid = M.impl.utils.getCentroidCoordinate(geometry);
//   let geom = new ol.geom.Point(centroid);
//   ol.renderer.vector.GEOMETRY_RENDERERS_[geom.getType()](replayGroup, geom, style, feature);
// };
//
// Object.assign(ol.renderer.vector.GEOMETRY_RENDERERS_, {
//   'LineString': M.impl.patches.renderLineStringGeometry_,
//   'Polygon': M.impl.patches.renderPolygonGeometry_,
//   'MultiPolygon': M.impl.patches.renderMultiPolygonGeometry_,
//   'MultiLineString': M.impl.patches.renderMultiLineStringGeometry_
// });
