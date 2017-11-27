goog.provide( 'M.impl.style.CentroidStyle' );

goog.require( 'ol.style.Style' );

(function () {

  /**
   * @classdesc custom root styles
   *
   * @constructor
   * @struct
   * @param {olx.style.StyleOptions=} opt_options Style options.
   * @api
   */
  M.impl.style.CentroidStyle = function ( opt_options = {} ) {
    ol.style.Style.call( this, opt_options );
  };
  ol.inherits( M.impl.style.CentroidStyle, ol.style.Style );

  /**
   * Clones the style.
   * @public
   * @return {M.impl.style.CentroidStyle} The cloned style.
   * @api stable
   */
  M.impl.style.CentroidStyle.prototype.clone = function () {
    var geometry = this.getGeometry();
    if ( geometry && geometry.clone ) {
      geometry = geometry.clone();
    }
    return new M.impl.style.CentroidStyle({
      geometry: geometry,
      fill: this.getFill() ? this.getFill().clone() : undefined,
      image: this.getImage() ? this.getImage().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      text: this.getText() ? this.getText().clone() : undefined,
      zIndex: this.getZIndex()
    });
  };

})();
