import Simple from("./stylesimple.js");
import PolygonImpl from('../../../impl/js/style/stylepolygon.js');

/**
 * @namespace M.style.Polygon
 */
export class Polygon extends Simple {

  /**
   * @classdesc
   * Creates a style polygon
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api stable
   */
  constructor(options) {
    if (Utils.isNullOrEmpty(options)) {
      options = Polygon.DEFAULT_NULL;
    }
    options = Utils.extends({}, options);
    let impl = new PolygonImpl(options);
    super(this, options, impl);
  }




  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Polygon.DEFAULT_NULL = {
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
      opacity: 0.4
    },
    stroke: {
      color: "#3399CC",
      width: 1.5
    }
  };
}
