goog.provide('ol.interaction.Hover');

goog.require('ol.interaction.Interaction');
/**
 * @classdesc
 * Main constructor of the class. Creates interaction hover
 * control
 *
 * @constructor
 * @param {Object} options - ranges defined by user
 * @api stable
 */
ol.interaction.Hover = function(options) {
  if (!options) {
    options={};
  }
	let self = this;

	ol.interaction.Interaction.call(this, {
    handleEvent: function(e) {
      if (e.type=="pointermove") {
        self.handleMove_(e);
      }
			if (options.handleEvent) {
        return options.handleEvent(e);
      }
      return true;
		}}
	);

	this.setFeatureFilter (options.featureFilter);
	this.setLayerFilter (options.layerFilter);
	this.setCursor (options.cursor);
};

ol.inherits(ol.interaction.Hover, ol.interaction.Interaction);

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.interaction.Hover.prototype.setMap = function(map) {
  if (this.previousCursor_!==undefined && this.getMap()) {
    this.getMap().getTargetElement().style.cursor = this.previousCursor_;
		this.previousCursor_ = undefined;
	}
	ol.interaction.Interaction.prototype.setMap.call (this, map);
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.interaction.Hover.prototype.setCursor = function(cursor) {
  if (!cursor && this.previousCursor_!==undefined && this.getMap()) {
    this.getMap().getTargetElement().style.cursor = this.previousCursor_;
		this.previousCursor_ = undefined;
	}
	this.cursor_ = cursor;
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.interaction.Hover.prototype.setFeatureFilter = function(filter) {
  if (typeof (filter) == 'function') {
    this.featureFilter_ = filter;
  }
	else {
    this.featureFilter_ = function(){ return true; };
  }
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.interaction.Hover.prototype.setLayerFilter = function(filter) {
  if (typeof (filter) == 'function') {
    this.layerFilter_ = filter;
  }
	else {
    this.layerFilter_ = function() {
      return true;
    };
  }
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.interaction.Hover.prototype.handleMove_ = function(e)
{	let map = this.getMap();
	if (map)
	{	//let b = map.hasFeatureAtPixel(e.pixel);
		let feature, layer;
		let self = this;
		let b = map.forEachFeatureAtPixel(e.pixel,
					function(f, l)
					{	if (self.layerFilter_.call(null, l)  && self.featureFilter_.call(null,f,l))
						{	feature = f;
							layer = l;
							return true;
						}
						else
						{	feature = layer = null;
							return false;
						}
					});

		if (b) this.dispatchEvent({ type:"hover", feature:feature, layer:layer, coordinate:e.coordinate, pixel: e.pixel, map: e.map, dragging:e.dragging });

		if (this.feature_===feature && this.layer_===layer)
		{
		}
		else
		{	this.feature_ = feature;
			this.layer_ = layer;
			if (feature) this.dispatchEvent({ type:"enter", feature:feature, layer:layer, coordinate:e.coordinate, pixel: e.pixel, map: e.map, dragging:e.dragging });
			else this.dispatchEvent({ type:"leave", coordinate:e.coordinate, pixel: e.pixel, map: e.map, dragging:e.dragging });
		}

		if (this.cursor_)
		{	let style = map.getTargetElement().style;
			if (b)
			{	if (style.cursor != this.cursor_)
				{	this.previousCursor_ = style.cursor;
					style.cursor = this.cursor_;
				}
			}
			else if (this.previousCursor_ !== undefined)
			{	style.cursor = this.previousCursor_;
				this.previousCursor_ = undefined;
			}
		}
	}
};
