goog.provide('M.filter.Intersects');
goog.require('M.Filter');

(function () {
  /**
   * Creates a Filter Function to filter features
   *
   * @api stable
   */
  M.filter.Intersects = (function (element) {
    this.olParser_ = new jsts.io.OL3Parser();
    this.geojsonParser_ = new jsts.io.OL3Parser();
    if (element instanceof M.layer.Vector) {
      this.vector_ = element;
    }
    else {
      this.geometry_ = element;
    }
  });
  goog.inherits(M.filter.Intersects, M.Filter);


  /*TODO*/
  M.filter.Intersects.prototype.execute = function (features) {
    let geometry = this.olParser_.read(this.geometry_);
    let featuresFiltered = features.filter(function (feature) {
      var intersection = geometry.intersection(this.olParser_.read(feature.getGeometry()));
      intersection = this.geojsonParser_.write(intersection);
      if (!M.utils.isNullOrEmpty(intersection.coordinates) && intersection.coordinates.length > 0) {
        return feature;
      }
    }.bind(this));
    return featuresFiltered;
  };

})();
