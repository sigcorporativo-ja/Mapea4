/**
 * @module M/impl/style/Centroid
 */
import OLStyle from 'ol/style/Style';
/**
 * @classdesc
 * @api
 */
class Centroid extends OLStyle {
  /**
   * @classdesc custom root styles
   *
   * @constructor
   * @struct
   * @param {olx.style.StyleOptions=} optOptions Style options.
   * @api
   */
  constructor(optOptions = {}) {
    super(optOptions);
  }

  /**
   * Clones the style.
   * @public
   * @return {M.impl.style.CentroidStyle} The cloned style.
   * @api stable
   */
  clone() {
    let geometry = this.getGeometry();
    if (geometry && geometry.clone) {
      geometry = geometry.clone();
    }
    return new Centroid({
      geometry,
      fill: this.getFill() ? this.getFill().clone() : undefined,
      image: this.getImage() ? this.getImage().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      text: this.getText() ? this.getText().clone() : undefined,
      zIndex: this.getZIndex(),
    });
  }
}

export default Centroid;
