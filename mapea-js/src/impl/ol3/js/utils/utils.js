goog.provide('M.impl.utils');

goog.require('goog.style');

/**
 * @namespace M.impl.utils
 */
(function () {

   /**
    *
    * @function
    * @api stable
    */
   M.impl.utils.generateResolutions = function (projection, extent, minZoom, maxZoom) {
      var generatedResolutions, defaultMaxZoom = 28;

      // extent
      if (M.utils.isNullOrEmpty(extent)) {
         extent = projection.getExtent();
      }
      // size
      var size = ol.extent.getWidth(extent) / 256;

      // zoom levels
      var zoomLevels;
      if (M.utils.isNullOrEmpty(minZoom)) {
         minZoom = ol.DEFAULT_MIN_ZOOM;
      }
      if (M.utils.isNullOrEmpty(maxZoom)) {
         maxZoom = defaultMaxZoom;
      }
      zoomLevels = maxZoom - minZoom;

      generatedResolutions = new Array(zoomLevels);
      for (var i = 0; i < zoomLevels; i++) {
         generatedResolutions[i] = size / Math.pow(2, i);
      }

      return generatedResolutions;
   };

   /**
    *
    * @function
    * @api stable
    */
   M.impl.utils.addOverlayImage = function (overlayImage, map) {
      var mapSize = map.getMapImpl().getSize();

      var screenXYAttr = 'screenXY';
      var screenXUnitsAttr = 'screenXUnits';
      var screenYUnitsAttr = 'screenYUnits';
      var overlayXYAttr = 'overlayXY';
      var overlayXUnitsAttr = 'overlayXUnits';
      var overlayYUnitsAttr = 'overlayYUnits';
      var rotationXYAttr = 'rotationXY';
      var sizeAttr = 'size';
      var srcAttr = 'src';

      var screenXY = overlayImage[screenXYAttr];
      var screenXUnits = overlayImage[screenXUnitsAttr];
      var screenYUnits = overlayImage[screenYUnitsAttr];
      var overlayXY = overlayImage[overlayXYAttr];
      var overlayXUnits = overlayImage[overlayXUnitsAttr];
      var overlayYUnits = overlayImage[overlayYUnitsAttr];
      var rotationXY = overlayImage[rotationXYAttr];
      var size = overlayImage[sizeAttr];
      var src = overlayImage[srcAttr];

      // src
      var img = goog.dom.createDom('img', {
         'src': src
      });
      // size
      goog.style.setWidth(img, size[0]);
      goog.style.setHeight(img, size[1]);

      // position
      var offsetX = overlayXY[0];
      if (overlayXUnits === ol.style.IconAnchorUnits.FRACTION) {
         offsetX = offsetX * size[0];
      }
      var offsetY = overlayXY[1];
      if (overlayYUnits === ol.style.IconAnchorUnits.FRACTION) {
         offsetY = (size[1] - (offsetY * size[1]));
      }
      goog.style.setStyle(img, 'position', 'absolute');
      var left = screenXY[0];
      if (screenXUnits === ol.style.IconAnchorUnits.FRACTION) {
         left = (left * mapSize[0]) - offsetX;
      }
      var top = screenXY[1];
      if (screenYUnits === ol.style.IconAnchorUnits.FRACTION) {
         top = (mapSize[1] - (top * mapSize[1])) - offsetY;
      }
      goog.style.setPosition(img, left, top);

      // parent
      var container = map.getMapImpl().getOverlayContainerStopEvent();
      container.appendChild(img);

      return img;
   };


   /**
    * Get the height of an extent.
    * @public
    * @function
    * @param {ol.Extent} extent Extent.
    * @return {number} Height.
    * @api stable
    */
   M.impl.utils.getExtentHeight = function (extent) {
      return extent[3] - extent[1];
   };

   /**
    * Get the width of an extent.
    * @public
    * @function
    * @param {ol.Extent} extent Extent.
    * @return {number} Width.
    * @api stable
    */
   M.impl.utils.getExtentWidth = function (extent) {
      return extent[2] - extent[0];
   };
})();