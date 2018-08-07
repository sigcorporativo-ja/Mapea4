import Feature from 'facade/js/feature/Feature';
import { clamp } from 'ol/math';
import Simple from "../style/Simple";
import OLLayerHeatmap from 'OLLayerHeatmap';
import olFeature from 'ol/Feature';
import OLStyle from 'ol/style/Style';
import OLStyleIcon from 'ol/style/Style';

export default class Heatmap extends OLLayerHeatmap {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Heatmap layer
   * with parameters specified by the user
   *
   * @constructor
   * @api stable
   */
  constructor(options = {}) {
    super(options);

    const weight = options.weight ? options.weight : 'weight';
    let weightFunction;
    if (typeof weight === 'string') {
      let maxWeight = 1;
      const features = this.getSource().getFeatures();
      if (features.length > 0) {
        maxWeight = features
          .map(feature => feature.get(options.weight))
          .filter(weight => weight != null)
          .reduce((current, next) => Math.max(current, next));
        this.maxWeight_ = maxWeight;
        this.minWeight_ = features
          .map(feature => feature.get(options.weight))
          .filter(weight => weight != null)
          .reduce((current, next) => Math.min(current, next));
        weightFunction = feature => {
          let value;
          if (feature instanceof OLFeature) {
            value = feature.get(weight);
          } else if (feature instanceof Feature) {
            value = feature.getAttribute(weight);
          }
          return parseFloat(value / maxWeight);
        };
      }
    } else {
      weightFunction = weight;
    }
    this.setStyle((feature, resolution) => {
      let weight = Simple.getValue(weightFunction, feature);
      let opacity = weight !== undefined ? clamp(weight, 0, 1) : 1;
      // cast to 8 bits
      let index = (255 * opacity) | 0;
      let style = this.styleCache_[index];
      if (!style) {
        style = [
        new OLStyle({
            image: new OLStyleIcon({
              opacity: opacity,
              src: this.circleImage_
            })
          })
      ];
        this.styleCache_[index] = style;
      }
      return style;
    });
  }

  getMinWeight() {
    return this.minWeight_;
  }

  getMaxWeight() {
    return this.maxWeight_;
  }
}
