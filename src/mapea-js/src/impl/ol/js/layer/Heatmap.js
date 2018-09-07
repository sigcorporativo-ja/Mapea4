import * as dialog from 'facade/js/dialog';
import OLLayerHeatmap from 'ol/layer/Heatmap';
import OLFeature from 'ol/Feature';
import OLStyle from 'ol/style/Style';
import OLStyleIcon from 'ol/style/Icon';
import Feature from 'facade/js/feature/Feature';
import { clamp } from 'ol/math';
import Simple from '../style/Simple';

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
      const weights = this.getWeights(options);
      if (weights.length > 0) {
        maxWeight = weights.reduce((current, next) => Math.max(current, next));
        this.maxWeight_ = maxWeight;
        this.minWeight_ = weights.reduce((current, next) => Math.min(current, next));
        weightFunction = (feature) => {
          let value;
          if (feature instanceof OLFeature) {
            value = feature.get(weight);
          } else if (feature instanceof Feature) {
            value = feature.getAttribute(weight);
          }
          return parseFloat(value / maxWeight);
        };
      } else {
        dialog.info(`La capa de nombre <b>${options.name}</b> no tiene ninguna feature <br/>
          con el atributo especificado en simbología establecida.
          <br/>Se setea una ponderación por defecto`, 'Mapa de calor');
      }
    } else {
      weightFunction = weight;
    }
    this.setStyle((feature, resolution) => {
      const weightParam = Simple.getValue(weightFunction, feature);
      const opacity = weightParam !== undefined ? clamp(weightParam, 0, 1) : 1;
      // cast to 8 bits
      const index = (255 * opacity) || 0;
      let style = this.styleCache_[index];
      if (!style) {
        style = [
          new OLStyle({
            image: new OLStyleIcon({
              opacity,
              src: this.circleImage_,
            }),
          }),
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

  getWeights(options) {
    let weights = [];
    const source = this.getSource();
    if (source !== null) {
      const features = source.getFeatures();
      if (features.lengt > 0) {
        weights = features.map(feature => feature.get(options.weight))
          .filter(weightVar => weightVar != null);
      }
    }
    return weights;
  }
}
