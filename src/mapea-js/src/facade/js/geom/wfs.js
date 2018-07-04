export default class WFS {
  WFS.type_ = {
    "POINT": "POINT",
    "LINE": "LINE",
    "POINT": "POINT",
  };

  static getType() {
    return WFS.type_ = {
      "POINT": "POINT",
      "LINE": "LINE",
      "POLYGON": "POLYGON",
      "MPOINT": "MPOINT",
      "MLINE": "MLINE",
      "MPOLYGON": "MPOLYGON"
    };
  }
}
