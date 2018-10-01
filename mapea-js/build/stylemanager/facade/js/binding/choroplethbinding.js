import {
  Binding
}
from './binding';

export class ChoroplethBinding extends Binding {
  constructor(html, htmlParent, styleType, styleParams, layer) {
    super(html, htmlParent, styleType, styleParams, layer);
  }


  setLayer(layer) {
    this.layer_ = layer;
    // this.setIntegerAttributes();
    return this;
  }

  setRanges() {
    let rangesButton = this.querySelector("[data-number-ranges]");
    let number = parseInt(rangesButton.value);
    let ranges = [];

    for (var i = 1; i <= number; i++) {
      ranges.push({
        number: i
      });
    }
    let parent = this.querySelector("[data-parent]");
    this.addTemplate('choroplethstyles.html', parent, {
      ranges: ranges
    });
  }


  addEventRangeListener() {
    let rangesButton = this.querySelector("[data-number-ranges]");
    rangesButton.addEventListener('input', this.setRanges.bind(this));
  }

  generateStyle() {
    let opts = this.generateOptions();
    let ranges = opts.ranges;
    let colors = opts.options.colors;
    let quantification = opts.quantification === "JENKS" ? M.style.quantification.JENKS : M.style.quantification.QUANTILE;
    let style = null;
    if (opts.attributeName != "") {
      style = new M.style.Choropleth(opts.attributeName, colors, quantification(ranges));
    }
    return style;
  }

  /**
   * @function
   *
   */
  getOptionsTemplate() {
    let options = ChoroplethBinding.DEFAULT_OPTIONS_STYLE;
    if (this.style_ != null) {
      let startColor = this.style_.getChoroplethStyles()[0].get("fill.color");
      let endColor = this.style_.getChoroplethStyles().slice(-1)[0].get("fill.color");
      startColor = startColor || this.style_.getChoroplethStyles()[0].get("stroke.color");
      endColor = endColor || this.style_.getChoroplethStyles().slice(-1)[0].get("stroke.color");

      options = {
        attribute: this.style_.getAttributeName(),
        ranges: this.style_.getChoroplethStyles().length,
        quantification: this.style_.getQuantification().name,
        startColor: startColor,
        endColor: endColor
      };
    }
    if (this.layer_ != null) {
      options["attributes"] = this.getAttributes();
      options["attributes"].forEach(attribute => attribute["selected"] = options.attribute);
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

ChoroplethBinding.DEFAULT_OPTIONS_STYLE = {
  attribute: "",
  quantification: "JENKS",
  ranges: 4,
  startColor: "#F8FF25",
  endColor: "#4400FD"
};
