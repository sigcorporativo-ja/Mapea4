import tooltipPointerHTML from '../../../templates/measure_pointer_tooltip';
import tooltipHTML from '../../../templates/measure_tooltip';

/**
 * @classdesc
 * Main constructor of the measure control.
 *
 * @constructor
 * @param {string} type - Type of the measure geometry
 * @extends {M.impl.Control}
 * @api stable
 */
export default class Measure extends M.impl.Control {
  constructor(type) {
    super();

    /**
     * Type of the measure geometry
     * @private
     * @type {string}
     */
    this.type_ = type;

    /**
     * Vector layer to draw the measures
     * @private
     * @type {ol.layer.Vector}
     */
    this.layer_ = this.createLayer_();

    /**
     * Map interaction
     * @private
     * @type {ol.interaction.Draw}
     */
    this.draw_ = this.createIteractionDraw_();

    /**
     * Overlay to show the help messages
     * @private
     * @type {ol.Overlay}
     */
    this.helpTooltip_ = null;

    /**
     * The measure tooltip element
     * @private
     * @type {ol.Overlay}
     */
    this.measureTooltip_ = null;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * Currently drawn feature.
     * @private
     * @type {ol.Feature}
     */
    this.currentFeature_ = null;

    /**
     * Currently drawn feature coordinate.
     * @private
     * @type {ol.Coordinate}
     */
    this.tooltipCoord_ = null;

    /**
     * Currently drawn feature coordinate.
     * @private
     * @type {array<ol.Overlay>}
     */
    this.overlays_ = [];
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;

    // adds layer
    map.getMapImpl().addLayer(this.layer_);

    // super addTo
    super.addTo(map, element);

    this.createHelpTooltip_();
    this.createMeasureTooltip_();
  }

  /**
   * This function enables plugin pressed
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.createHelpTooltip_();
    this.facadeMap_.getMapImpl().on('pointermove', this.pointerMoveHandler_.bind(this));
    this.facadeMap_.getMapImpl().addInteraction(this.draw_);
    this.active = true;

    this.createMeasureTooltip_();
  }

  /**
   * This function dissable plugin
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.facadeMap_.getMapImpl().un('pointermove', this.pointerMoveHandler_.bind(this));
    this.facadeMap_.getMapImpl().removeInteraction(this.draw_);
    this.clear();
    if (!M.utils.isNullOrEmpty(this.helpTooltip_)) {
      this.facadeMap_.getMapImpl().removeOverlay(this.helpTooltip_);
    }
    if (!M.utils.isNullOrEmpty(this.measureTooltip_)) {
      this.facadeMap_.getMapImpl().removeOverlay(this.measureTooltip_);
    }
    this.active = false;
  }

  /**
   * This function create Vector layer to draw the measures
   *
   * @function
   * @private
   * @return {ol.layer.Vector} layer - Vector layer
   */
  createLayer_() {
    const layer = new ol.layer.Vector({
      source: new ol.source.Vector({}),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(51, 124, 235, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#337ceb',
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#337ceb',
          }),
        }),
      }),
      zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 99,
    });
    return layer;
  }

  /**
   * This function create interaction draw
   *
   * @private
   * @function
   * @return {ol.interaction.Draw} draw - Interaction draw
   */
  createIteractionDraw_() {
    const draw = new ol.interaction.Draw({
      source: this.layer_.getSource(),
      type: this.type_,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.5)',
        }),
        stroke: new ol.style.Stroke({
          color: '#b54d01',
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: '#b54d01',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)',
          }),
        }),
      }),
    });
    draw.on('drawstart', this.onDrawStart_.bind(this));
    draw.on('drawend', this.onDrawEnd_.bind(this));

    return draw;
  }

  /**
   * This function create tooltip with the help
   *
   * @private
   * @function
   * @return {Promise} Template tooltip
   */
  createHelpTooltip_() {
    const helpTooltipElement = M.template.compile(tooltipPointerHTML, { jsonp: true });
    this.helpTooltip_ = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    });
    this.facadeMap_.getMapImpl().addOverlay(this.helpTooltip_);
  }

  /**
   * This function create Measure tooltip
   *
   * @private
   * @function
   */
  createMeasureTooltip_() {
    const measureTooltipElement = M.template.compile(tooltipHTML, { jsonp: true });
    if (!M.utils.isNullOrEmpty(this.measureTooltip_)) {
      this.overlays_.push(this.measureTooltip_);
    }
    this.measureTooltip_ = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
    });
    this.facadeMap_.getMapImpl().addOverlay(this.measureTooltip_);
  }

  /**
   * This function allows start to draw
   * @private
   * @function
   * @param {goog.events.Event} evt - Event draw start
   */
  onDrawStart_(evt) {
    this.currentFeature_ = evt.feature;
    this.tooltipCoord_ = evt.coordinate;
    this.currentFeature_.getGeometry().on('change', this.onGeometryChange_.bind(this));
  }

  /**
   * This function allows end to draw
   *
   * @private
   * @function
   * @param {goog.events.Event} evt - Event draw end
   */
  onDrawEnd_(evt) {
    this.currentFeature_.getGeometry().un('change', this.onGeometryChange_);

    // unset sketch
    this.currentFeature_ = null;
    this.measureTooltip_.getElement().classList.add('static');
    this.measureTooltip_.setOffset([0, -7]);

    this.createMeasureTooltip_();
  }

  /**
   * Handle pointer move.
   *
   * private
   * function
   * @param {ol.MapBrowserEvent} evt - Event pointer move
   */
  pointerMoveHandler_(evt) {
    if (evt.dragging) {
      return;
    }
    let helpMsg = this.helpMsg_;
    if (this.currentFeature_) {
      helpMsg = this.helpMsgContinue_;
    }
    if (!M.utils.isNullOrEmpty(this.helpTooltip_)) {
      this.helpTooltip_.getElement().innerHTML = helpMsg;
      this.helpTooltip_.setPosition(evt.coordinate);
    }
  }

  /**
   * Handle pointer move.
   * private
   * function
   * @param {ol.MapBrowserEvent} evt - Event pointer change
   */
  onGeometryChange_(evt) {
    const newGeometry = evt.target;
    const tooltipText = this.formatGeometry(newGeometry);
    const tooltipCoord = this.getTooltipCoordinate(newGeometry);

    if (!M.utils.isNullOrEmpty(this.measureTooltip_)) {
      this.measureTooltip_.getElement().innerHTML = tooltipText;
      this.measureTooltip_.setPosition(tooltipCoord);
    }
  }

  /**
   * Clear all measures
   *
   * @public
   * @function
   * @api stable
   */
  clear() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.layer_.getSource().clear();
    }
    this.overlays_.forEach((overlay) => {
      this.facadeMap_.getMapImpl().removeOverlay(overlay);
    }, this);
    this.overlays_.length = 0;
  }


  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.deactivate();
    this.element.remove();
    this.facadeMap_.removeControls(this);
    this.facadeMap_ = null;
    this.overlays_.length = 0;
  }
}
