/**
 * @module M/impl/style/Icon
 */
import OLStyleIcon from 'ol/style/Icon';
/**
 * @classdesc
 * @api
 */
class Icon extends OLStyleIcon {
  /**
   * Real Image size used.
   * @public
   * @return {ol.Size} Size.
   * @api stable
   * @expose
   */
  getImageSize() {
    return this.iconImage_.getSize();
  }
}

export default Icon;
