goog.provide( 'M.impl.style.OLStyle' );

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
  M.impl.style.OLStyle = function ( opt_options = {} ) {
    ol.style.Style.call( this, opt_options );
  };
  ol.inherits( M.impl.style.OLStyle, ol.style.Style );

  /**
   * Clones the style.
   * @return {M.impl.style.OLStyle} The cloned style.
   * @api
   */
  M.impl.style.OLStyle.prototype.clone = function () {
    var geometry = this.getGeometry();
    if ( geometry && geometry.clone ) {
      geometry = geometry.clone();
    }
    return new M.impl.style.OLStyle({
      geometry: geometry,
      fill: this.getFill() ? this.getFill().clone() : undefined,
      image: this.getImage() ? this.getImage().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      text: this.getText() ? this.getText().clone() : undefined,
      zIndex: this.getZIndex()
    });
  };

})();
