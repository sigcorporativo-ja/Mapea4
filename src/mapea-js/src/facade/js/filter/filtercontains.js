goog.provide('M.filter.Contains');
goog.require('M.Filter');

(function () {
  /**
   * Creates a Filter Function to filter features
   *
   * @api stable
   */
  M.filter.Contains = (function (element) {
    this.olParser_ = new jsts.io.OL3Parser();
    this.geojsonParser_ = new jsts.io.OL3Parser();
    if (element instanceof M.layer.Vector) {
      this.vector_ = element;
    }
    else {
      this.geometry_ = element;
    }
  });
  goog.inherits(M.filter.Contains, M.Filter);


  /*TODO*/
  M.filter.Contains.prototype.execute = function (features) {
    let geometry = this.olParser_.read(this.geometry_);
    let featuresFiltered = features.filter(function (feature) {
      if (geometry.contains(this.olParser_.read(feature.getGeometry()))) {
        return feature;
      }
    }.bind(this));
    return featuresFiltered;
  };

})();
