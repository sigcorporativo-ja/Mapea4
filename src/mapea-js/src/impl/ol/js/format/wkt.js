import OLWKT from "ol/format/WKT";
import GeoJSON from "./geojsonformat";

export default class WKT extends OLWKT {

  /**
   * @classdesc
   * Feature format for reading and writing data in the GeoJSON format.
   *
   * @constructor
   * @extends {ol.format.JSONFeature}
   * @param {olx.format.GeoJSONOptions=} opt_options Options.
   * @api stable
   */
  constructor(options = {}) {
    super(options);
    this.gjFormat_ = new GeoJSON();
  };

  /**
   * @inheritDoc
   */
  write(geometry) {
    let wktGeom;
    let olGeometry = this.gjFormat_.readGeometryFromObject(geometry);
    if (olGeometry.getType().toLowerCase() === "point") {
      let pointCoord = olGeometry.getCoordinates();
      olGeometry.setCoordinates([pointCoord[0], pointCoord[1]]);
    }
    wktGeom = this.writeGeometryText(olGeometry);
    return wktGeom;
  };

}
