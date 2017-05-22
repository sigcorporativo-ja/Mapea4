goog.provide('M.filter.Disjoint');
goog.require('M.Filter');

(function () {
  /**
   * Creates a Filter Function to filter features
   *
   * @api stable
   */
  M.filter.Disjoint = (function (element) {
    this.olParser_ = new jsts.io.OL3Parser();
    this.geojsonParser_ = new jsts.io.OL3Parser();
    if (element instanceof M.layer.Vector) {
      this.vector_ = element;
    }
    else {
      this.geometry_ = element;
    }
  });
  goog.inherits(M.filter.Disjoint, M.Filter);


  /*TODO*/
  M.filter.Disjoint.prototype.execute = function (features) {
    let geometry = this.olParser_.read(this.geometry_);
    let featuresFiltered = features.filter(function (feature) {
      if (geometry.disjoint(this.olParser_.read(feature.getGeometry()))) {
        return feature;
      }
    }.bind(this));
    return featuresFiltered;
  };

})();
