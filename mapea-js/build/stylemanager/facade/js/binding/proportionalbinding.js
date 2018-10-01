import {
  Binding
}
from './binding';

export class ProportionalBinding extends Binding {
  constructor(html, htmlParent, styleType, styleParams, layer) {
    super(html, htmlParent, styleType, styleParams, layer);
  }

  /**
   * This function sets the attribute layer to the binding.
   * @function
   * @param {M.layer.Vector}
   */
  setLayer(layer) {
    this.layer_ = layer;
    // this.setIntegerAttributes();
    return this;
  }

  /**
   * This function generates the cluster style from GUI Options.
   *
   * @function
   * @returns {M.style.Cluster}
   */
  generateStyle() {
    let opts = this.generateOptions();
    let style = null;
    if (opts.attributeName != "") {
      style = new M.style.Proportional(opts.attributeName, opts.minRadius, opts.maxRadius);
    }
    return style;
  }

  /**
   * @function
   *
   */
  getOptionsTemplate() {
    let options = ProportionalBinding.DEFAULT_OPTIONS_STYLE;
    if (this.style_ != null) {
      options = {
        attributeName: this.style_.getAttributeName(),
        minRadius: this.style_.getMinRadius(),
        maxRadius: this.style_.getMaxRadius()
      };
      this.setSelected(true);
    }
    if (this.layer_ != null) {
      options["attributes"] = this.getAttributes();
      options["attributes"].forEach(attribute => attribute["selected"] = options.attributeName);
    }
    return options;
  }

  /**
   * @function
   */
  getAttributes() {
    let attributeNames = this.filterAttributesFeature("number").map(element => {
      return {
        name: element
      };
    });
    return attributeNames;
  }
}

ProportionalBinding.DEFAULT_OPTIONS_STYLE = {
  attributeName: "",
  minRadius: 12,
  maxRadius: 25,
};
