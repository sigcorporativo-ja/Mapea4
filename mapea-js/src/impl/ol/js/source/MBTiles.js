import XYZ from 'ol/source/XYZ';

class MBTiles extends XYZ {
  constructor(opt) {
    const options = {
      ...opt,
      tileUrlFunction: MBTiles.tileUrlFunction,
    };

    super(options);
  }

  static tileUrlFunction(c) {
    return '';
  }
}

export default MBTiles;
