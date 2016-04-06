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
 * @inheritDoc
 * PATCH: prevent render tiles diferent zoom levels!
 */
ol.renderer.canvas.TileLayer.prototype.prepareFrame =
   function (frameState, layerState) {

      //
      // Warning! You're entering a dangerous zone!
      //
      // The canvas tile layer renderering is highly optimized, hence
      // the complexity of this function. For best performance we try
      // to minimize the number of pixels to update on the canvas. This
      // includes:
      //
      // - Only drawing pixels that will be visible.
      // - Not re-drawing pixels/tiles that are already correct.
      // - Minimizing calls to clearRect.
      // - Never shrink the canvas. Just make it bigger when necessary.
      //   Re-sizing the canvas also clears it, which further means
      //   re-creating it (expensive).
      //
      // The various steps performed by this functions:
      //
      // - Create a canvas element if none has been created yet.
      //
      // - Make the canvas bigger if it's too small. Note that we never shrink
      //   the canvas, we just make it bigger when necessary, when rotating for
      //   example. Note also that the canvas always contains a whole number
      //   of tiles.
      //
      // - Invalidate the canvas tile range (renderedCanvasTileRange_ = null)
      //   if (1) the canvas has been enlarged, or (2) the zoom level changes,
      //   or (3) the canvas tile range doesn't contain the required tile
      //   range. This canvas tile range invalidation thing is related to
      //   an optimization where we attempt to redraw as few pixels as
      //   possible on each prepareFrame call.
      //
      // - If the canvas tile range has been invalidated we reset
      //   renderedCanvasTileRange_ and reset the renderedTiles_ array.
      //   The renderedTiles_ array is the structure used to determine
      //   the canvas pixels that need not be redrawn from one prepareFrame
      //   call to another. It records while tile has been rendered at
      //   which position in the canvas.
      //
      // - We then determine the tiles to draw on the canvas. Tiles for
      //   the target resolution may not be loaded yet. In that case we
      //   use low-resolution/interim tiles if loaded already. And, if
      //   for a non-yet-loaded tile we haven't found a corresponding
      //   low-resolution tile we indicate that the pixels for that
      //   tile must be cleared on the canvas. Note: determining the
      //   interim tiles is based on tile extents instead of tile
      //   coords, this is to be able to handler irregular tile grids.
      //
      // - We're now ready to render. We start by calling clearRect
      //   for the tiles that aren't loaded yet and are not fully covered
      //   by a low-resolution tile (if they're loaded, we'll draw them;
      //   if they're fully covered by a low-resolution tile then there's
      //   no need to clear). We then render the tiles "back to front",
      //   i.e. starting with the low-resolution tiles.
      //
      // - After rendering some bookkeeping is performed (updateUsedTiles,
      //   etc.). manageTilePyramid is what enqueue tiles in the tile
      //   queue for loading.
      //
      // - The last step involves updating the image transform matrix,
      //   which will be used by the map renderer for the final
      //   composition and positioning.
      //

      var pixelRatio = frameState.pixelRatio;
      var viewState = frameState.viewState;
      var projection = viewState.projection;

      var tileLayer = this.getLayer();
      goog.asserts.assertInstanceof(tileLayer, ol.layer.Tile,
         'layer is an instance of ol.layer.Tile');
      var tileSource = tileLayer.getSource();
      var tileGrid = tileSource.getTileGridForProjection(projection);
      var tileGutter = tileSource.getGutter();
      var z = tileGrid.getZForResolution(viewState.resolution);
      var tilePixelSize =
         tileSource.getTilePixelSize(z, frameState.pixelRatio, projection);
      var tilePixelRatio = tilePixelSize[0] /
         ol.size.toSize(tileGrid.getTileSize(z), this.tmpSize_)[0];
      var tileResolution = tileGrid.getResolution(z);
      var tilePixelResolution = tileResolution / tilePixelRatio;
      var center = viewState.center;
      var extent;
      if (tileResolution == viewState.resolution) {
         center = this.snapCenterToPixel(center, tileResolution, frameState.size);
         extent = ol.extent.getForViewAndSize(
            center, tileResolution, viewState.rotation, frameState.size);
      }
      else {
         extent = frameState.extent;
      }

      if (layerState.extent !== undefined) {
         extent = ol.extent.getIntersection(extent, layerState.extent);
      }
      if (ol.extent.isEmpty(extent)) {
         // Return false to prevent the rendering of the layer.
         return false;
      }

      var tileRange = tileGrid.getTileRangeForExtentAndResolution(
         extent, tileResolution);

      var canvasWidth = tilePixelSize[0] * tileRange.getWidth();
      var canvasHeight = tilePixelSize[1] * tileRange.getHeight();

      var canvas, context;
      if (!this.canvas_) {
         goog.asserts.assert(!this.canvasSize_,
            'canvasSize is null (because canvas is null)');
         goog.asserts.assert(!this.context_,
            'context is null (because canvas is null)');
         goog.asserts.assert(!this.renderedCanvasTileRange_,
            'renderedCanvasTileRange is null (because canvas is null)');
         context = ol.dom.createCanvasContext2D(canvasWidth, canvasHeight);
         this.canvas_ = context.canvas;
         this.canvasSize_ = [canvasWidth, canvasHeight];
         this.context_ = context;
         this.canvasTooBig_ = !ol.renderer.canvas.Layer.testCanvasSize(this.canvasSize_);
      }
      else {
         goog.asserts.assert(this.canvasSize_,
            'non-null canvasSize (because canvas is not null)');
         goog.asserts.assert(this.context_,
            'non-null context (because canvas is not null)');
         canvas = this.canvas_;
         context = this.context_;
         if (this.canvasSize_[0] < canvasWidth ||
            this.canvasSize_[1] < canvasHeight ||
            this.renderedTileWidth_ !== tilePixelSize[0] ||
            this.renderedTileHeight_ !== tilePixelSize[1] ||
            (this.canvasTooBig_ && (this.canvasSize_[0] > canvasWidth ||
               this.canvasSize_[1] > canvasHeight))) {
            // Canvas is too small or tileSize has changed, resize it.
            // We never shrink the canvas, unless
            // we know that the current canvas size exceeds the maximum size
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            this.canvasSize_ = [canvasWidth, canvasHeight];
            this.canvasTooBig_ = !ol.renderer.canvas.Layer.testCanvasSize(this.canvasSize_);
            this.renderedCanvasTileRange_ = null;
         }
         else {
            canvasWidth = this.canvasSize_[0];
            canvasHeight = this.canvasSize_[1];
            if (z != this.renderedCanvasZ_ ||
               !this.renderedCanvasTileRange_.containsTileRange(tileRange)) {
               this.renderedCanvasTileRange_ = null;
            }
         }
      }

      var canvasTileRange, canvasTileRangeWidth, minX, minY;
      if (!this.renderedCanvasTileRange_) {
         canvasTileRangeWidth = canvasWidth / tilePixelSize[0];
         var canvasTileRangeHeight = canvasHeight / tilePixelSize[1];
         minX = tileRange.minX -
            Math.floor((canvasTileRangeWidth - tileRange.getWidth()) / 2);
         minY = tileRange.minY -
            Math.floor((canvasTileRangeHeight - tileRange.getHeight()) / 2);
         this.renderedCanvasZ_ = z;
         this.renderedTileWidth_ = tilePixelSize[0];
         this.renderedTileHeight_ = tilePixelSize[1];
         this.renderedCanvasTileRange_ = new ol.TileRange(
            minX, minX + canvasTileRangeWidth - 1,
            minY, minY + canvasTileRangeHeight - 1);
         this.renderedTiles_ =
            new Array(canvasTileRangeWidth * canvasTileRangeHeight);
         canvasTileRange = this.renderedCanvasTileRange_;
      }
      else {
         canvasTileRange = this.renderedCanvasTileRange_;
         canvasTileRangeWidth = canvasTileRange.getWidth();
      }

      goog.asserts.assert(canvasTileRange.containsTileRange(tileRange),
         'tileRange is contained in canvasTileRange');

      /**
       * @type {Object.<number, Object.<string, ol.Tile>>}
       */
      var tilesToDrawByZ = {};
      tilesToDrawByZ[z] = {};
      /** @type {Array.<ol.Tile>} */
      var tilesToClear = [];

      var findLoadedTiles = this.createLoadedTileFinder(
         tileSource, projection, tilesToDrawByZ);

      var useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();

      var tmpExtent = ol.extent.createEmpty();
      var tmpTileRange = new ol.TileRange(0, 0, 0, 0);
      var childTileRange, fullyLoaded, tile, tileState, x, y;
      for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
         for (y = tileRange.minY; y <= tileRange.maxY; ++y) {

            tile = tileSource.getTile(z, x, y, pixelRatio, projection);
            tileState = tile.getState();
            if (tileState == ol.TileState.LOADED ||
               tileState == ol.TileState.EMPTY ||
               (tileState == ol.TileState.ERROR && !useInterimTilesOnError)) {
               tilesToDrawByZ[z][ol.tilecoord.toString(tile.tileCoord)] = tile;
               continue;
            }

            fullyLoaded = tileGrid.forEachTileCoordParentTileRange(
               tile.tileCoord, findLoadedTiles, null, tmpTileRange, tmpExtent);
            if (!fullyLoaded) {
               // FIXME we do not need to clear the tile if it is fully covered by its
               //       children
               tilesToClear.push(tile);
               childTileRange = tileGrid.getTileCoordChildTileRange(
                  tile.tileCoord, tmpTileRange, tmpExtent);
               if (childTileRange) {
                  findLoadedTiles(z + 1, childTileRange);
               }
            }

         }
      }

      var i, ii;
      for (i = 0, ii = tilesToClear.length; i < ii; ++i) {
         tile = tilesToClear[i];
         x = tilePixelSize[0] * (tile.tileCoord[1] - canvasTileRange.minX);
         y = tilePixelSize[1] * (canvasTileRange.maxY - tile.tileCoord[2]);
         context.clearRect(x, y, tilePixelSize[0], tilePixelSize[1]);
      }

      /** @type {Array.<number>} */
      var zs = Object.keys(tilesToDrawByZ).map(Number);
      goog.array.sort(zs);
      var opaque = tileSource.getOpaque();
      var origin = ol.extent.getTopLeft(tileGrid.getTileCoordExtent(
      [z, canvasTileRange.minX, canvasTileRange.maxY],
         tmpExtent));
      var currentZ, index, scale, tileCoordKey, tileExtent, tilesToDraw;
      var ix, iy, interimTileRange, maxX, maxY;
      var height, width;
      for (i = 0, ii = zs.length; i < ii; ++i) {
         currentZ = zs[i];
         tilePixelSize =
            tileSource.getTilePixelSize(currentZ, pixelRatio, projection);
         tilesToDraw = tilesToDrawByZ[currentZ];
         if (currentZ == z) {
            for (tileCoordKey in tilesToDraw) {
               tile = tilesToDraw[tileCoordKey];
               index =
                  (tile.tileCoord[2] - canvasTileRange.minY) * canvasTileRangeWidth +
                  (tile.tileCoord[1] - canvasTileRange.minX);
               if (this.renderedTiles_[index] != tile) {
                  x = tilePixelSize[0] * (tile.tileCoord[1] - canvasTileRange.minX);
                  y = tilePixelSize[1] * (canvasTileRange.maxY - tile.tileCoord[2]);
                  tileState = tile.getState();
                  if (tileState == ol.TileState.EMPTY ||
                     (tileState == ol.TileState.ERROR && !useInterimTilesOnError) ||
                     !opaque) {
                     context.clearRect(x, y, tilePixelSize[0], tilePixelSize[1]);
                  }
                  if (tileState == ol.TileState.LOADED) {
                     context.drawImage(tile.getImage(),
                        tileGutter, tileGutter, tilePixelSize[0], tilePixelSize[1],
                        x, y, tilePixelSize[0], tilePixelSize[1]);
                  }
                  this.renderedTiles_[index] = tile;
               }
            }
         }
         else {
            scale = tileGrid.getResolution(currentZ) / tileResolution;
            // PATCH: checks if it is base layer --- init
            var isBaseLayer = (layerState.layer.get("base") === true);
            // ------------------------------------- end
            for (tileCoordKey in tilesToDraw) {
               tile = tilesToDraw[tileCoordKey];
               tileExtent = tileGrid.getTileCoordExtent(tile.tileCoord, tmpExtent);
               x = (tileExtent[0] - origin[0]) / tilePixelResolution;
               y = (origin[1] - tileExtent[3]) / tilePixelResolution;
               width = scale * tilePixelSize[0];
               height = scale * tilePixelSize[1];
               tileState = tile.getState();
               // PATCH: always removes image for layers that aren't base --- init
               //                              if (tileState == ol.TileState.EMPTY || !opaque) {
               if (tileState == ol.TileState.EMPTY || !opaque || !isBaseLayer) {
                  // -------------------------------------------------------- end          
                  context.clearRect(x, y, width, height);
               }
               // PATCH: draws zoomed images if they are base --- init
               //                                if (tileState == ol.TileState.LOADED) {
               if ((tileState == ol.TileState.LOADED) && isBaseLayer) {
                  // -------------------------------------------- end             
                  context.drawImage(tile.getImage(),
                     tileGutter, tileGutter, tilePixelSize[0], tilePixelSize[1],
                     x, y, width, height);
               }
               interimTileRange =
                  tileGrid.getTileRangeForExtentAndZ(tileExtent, z, tmpTileRange);
               minX = Math.max(interimTileRange.minX, canvasTileRange.minX);
               maxX = Math.min(interimTileRange.maxX, canvasTileRange.maxX);
               minY = Math.max(interimTileRange.minY, canvasTileRange.minY);
               maxY = Math.min(interimTileRange.maxY, canvasTileRange.maxY);
               for (ix = minX; ix <= maxX; ++ix) {
                  for (iy = minY; iy <= maxY; ++iy) {
                     index = (iy - canvasTileRange.minY) * canvasTileRangeWidth +
                        (ix - canvasTileRange.minX);
                     this.renderedTiles_[index] = undefined;
                  }
               }
            }
         }
      }

      this.updateUsedTiles(frameState.usedTiles, tileSource, z, tileRange);
      this.manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio,
         projection, extent, z, tileLayer.getPreload());
      this.scheduleExpireCache(frameState, tileSource);
      this.updateLogos(frameState, tileSource);

      ol.vec.Mat4.makeTransform2D(this.imageTransform_,
         pixelRatio * frameState.size[0] / 2,
         pixelRatio * frameState.size[1] / 2,
         pixelRatio * tilePixelResolution / viewState.resolution,
         pixelRatio * tilePixelResolution / viewState.resolution,
         viewState.rotation, (origin[0] - center[0]) / tilePixelResolution, (center[1] - origin[1]) / tilePixelResolution);
      this.imageTransformInv_ = null;

      return true;
   };



/**
 * Encode format as WFS `Transaction` and return the Node.
 *
 * @param {Array.<ol.Feature>} inserts The features to insert.
 * @param {Array.<ol.Feature>} updates The features to update.
 * @param {Array.<ol.Feature>} deletes The features to delete.
 * @param {olx.format.WFSWriteTransactionOptions} options Write options.
 * @return {Node} Result.
 * @api stable
 *
 * PATCH: WFS-T version 1.0.0
 */
ol.format.WFS.prototype.writeTransaction = function (inserts, updates, deletes,
   options) {
   var objectStack = [];
   var node = ol.xml.createElementNS('http://www.opengis.net/wfs',
      'Transaction');
   node.setAttribute('service', 'WFS');
   node.setAttribute('version', '1.1.0');
   var baseObj, obj;
   if (options) {
      baseObj = options.gmlOptions ? options.gmlOptions : {};
      if (options.handle) {
         node.setAttribute('handle', options.handle);
      }
   }
   ol.xml.setAttributeNS(node, 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation', this.schemaLocation_);
   if (inserts) {
      obj = {
         node: node,
         featureNS: options.featureNS,
         featureType: options.featureType,
         featurePrefix: options.featurePrefix
      };
      goog.object.extend(obj, baseObj);
      ol.xml.pushSerializeAndPop(obj,
         ol.format.WFS.TRANSACTION_SERIALIZERS_,
         ol.xml.makeSimpleNodeFactory('Insert'), inserts,
         objectStack);
   }
   if (updates) {
      obj = {
         node: node,
         featureNS: options.featureNS,
         featureType: options.featureType,
         featurePrefix: options.featurePrefix
      };
      goog.object.extend(obj, baseObj);
      ol.xml.pushSerializeAndPop(obj,
         ol.format.WFS.TRANSACTION_SERIALIZERS_,
         ol.xml.makeSimpleNodeFactory('Update'), updates,
         objectStack);
   }
   if (deletes) {
      ol.xml.pushSerializeAndPop({
            node: node,
            featureNS: options.featureNS,
            featureType: options.featureType,
            featurePrefix: options.featurePrefix
         },
         ol.format.WFS.TRANSACTION_SERIALIZERS_,
         ol.xml.makeSimpleNodeFactory('Delete'), deletes,
         objectStack);
   }
   if (options.nativeElements) {
      ol.xml.pushSerializeAndPop({
            node: node,
            featureNS: options.featureNS,
            featureType: options.featureType,
            featurePrefix: options.featurePrefix
         },
         ol.format.WFS.TRANSACTION_SERIALIZERS_,
         ol.xml.makeSimpleNodeFactory('Native'), options.nativeElements,
         objectStack);
   }
   return node;
};



/**
 * @param {Node} node Node.
 * @param {ol.geom.Point} value Point geometry.
 * @param {Array.<*>} objectStack Node stack.
 * @private
 *
 * PATCH: disables axis order configuration
 */
ol.format.GML3.prototype.writePos_ = function (node, value, objectStack) {
   var context = objectStack[objectStack.length - 1];
   goog.asserts.assert(goog.isObject(context), 'context should be an Object');
   // PATCH: ------------------------------ init
   //  var srsName = context['srsName'];
   //  var axisOrientation = 'enu';
   //  if (srsName) {
   //    axisOrientation = ol.proj.get(srsName).getAxisOrientation();
   //  }
   // ------------------------------------- end
   var point = value.getCoordinates();
   var coords;
   // PATCH: ------------------------------ init
   // only 2d for simple features profile
   //  if (axisOrientation.substr(0, 2) === 'en') {
   // ------------------------------------- end
   coords = (point[0] + ' ' + point[1]);
   // PATCH: ------------------------------ init
   //  } else {
   //    coords = (point[1] + ' ' + point[0]);
   //  }
   // ------------------------------------- end
   ol.format.XSD.writeStringTextNode(node, coords);
};

/**
 * @param {Array.<number>} point Point geometry.
 * @param {string=} opt_srsName Optional srsName
 * @return {string}
 * @private
 *
 * PATCH: disables axis order configuration
 */
ol.format.GML3.prototype.getCoords_ = function (point, opt_srsName) {
   // PATCH: ------------------------------ init
   //   var axisOrientation = 'enu';
   //   if (opt_srsName) {
   //      axisOrientation = ol.proj.get(opt_srsName).getAxisOrientation();
   //   }
   //   return ((axisOrientation.substr(0, 2) === 'en') ?
   //      point[0] + ' ' + point[1] :
   //      point[1] + ' ' + point[0]);

   return (point[0] + ' ' + point[1]);
   // ------------------------------------- end
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
         goog.dom.replaceNode(this.collapseLabel_, this.label_);
      }
      else {
         goog.dom.replaceNode(this.label_, this.collapseLabel_);
      }
      this.collapsed_ = !this.collapsed_;

      // manage overview map if it had not been rendered before and control
      // is expanded
      var ovmap = this.ovmap_;
      if (!this.collapsed_ && !ovmap.isRendered()) {
         ovmap.updateSize();
         this.resetExtent_();
         goog.events.listenOnce(ovmap, ol.MapEventType.POSTRENDER,
            function (event) {
               this.updateBox_();
            },
            false, this);
      }
   }.bind(this), this.toggleDelay_);
};