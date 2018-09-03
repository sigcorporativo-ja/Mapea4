import OLView from 'ol/View';

export default class View extends OLView {
  /**
   * @classdesc
   *
   * @constructor
   * @extends {ol.View}
   * @param {olx.ViewOptions=} opt_options View options.
   * @api stable
   */
  constructor(options) {
    super(options);

    this.userZoom_ = null;
  }

  /**
   * Zoom to a specific zoom level from user
   * @param {number} zoom Zoom level.
   * @api stable
   */
  setUserZoom(zoom) {
    this.userZoom_ = zoom;
    this.setZoom(zoom);
  }

  /**
   * Provides the zoom user
   * @param {number} zoom Zoom level.
   * @api stable
   */
  getUserZoom(zoom) {
    return this.userZoom_;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {ol.proj.Projection} projection to apply to the map
   * @api stable
   */
  setProjection(projection) {
    this.projection_ = projection;
  }

  /**
   * This function provides the resolutions of the specified view
   *
   * @public
   * @function
   * @returns {Array<Number>} the resolutions
   * @api stable
   */
  getResolutions() {
    return this.get('resolutions');
  }

  /**
   * This function adds sets resolutions of the specified map
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions to apply to the map
   * @api stable
   */
  setResolutions(resolutions) {
    this.set('resolutions', resolutions);
    this.maxResolution_ = resolutions[0];
    this.minResolution_ = resolutions[resolutions.length - 1];
    // this.constraints_.resolution = View.createSnapToResolutions(resolutions);
    // updates zoom
    // updates center
    // this.setCenter(this.getCenter());
    this.applyOptions_({
      minZoom: this.minZoom_,
      resolutions,
      zoomFactor: this.zoomFactor_,
      minResolution: this.minResolution_,
      maxResolution: this.maxResolution_,
      projection: this.projection_,
      center: this.getCenter(),
    });
    // this.setZoom(this.userZoom_);
  }
}
