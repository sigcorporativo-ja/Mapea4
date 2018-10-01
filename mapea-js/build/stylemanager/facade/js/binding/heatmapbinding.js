import {
  Binding
}
from './binding';

export class HeatmapBinding extends Binding {
  constructor(html, htmlParent, styleType, styleParams, layer) {
    super(html, htmlParent, styleType, styleParams, layer);
    this.style_ = null;
    this.compilePromise_.then(() => {
      this.removeGradientListener();
      this.addGradientListener();
    });
    this.numberAddedColors_ = 6;
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  setLayer(layer) {
    this.layer_ = layer;
    this.style_ = null;
    // this.setIntegerAttributes();
    return this;

  }

  /**
   * This function adds the event listener to remove gradient color option.
   * @function
   */
  removeGradientListener() {
    this.querySelectorAllForEach('.m-removable-input-color .m-close', element => {
      element.addEventListener('click', () => {
        let rootElement = element.parentElement.parentElement;
        rootElement.removeChild(element.parentElement);
        this.numberAddedColors_--;
      });
    });
  }

  /**
   * This function adds the event listener to add gradient color option.
   * @function
   */
  addGradientListener() {
    let parent = this.querySelector("[data-parent='gradient']");
    this.querySelector("[data-add]").addEventListener('click', () => {
      this.compileTemplate("gradientheatmap.html", {}).then((html) => {
        if (this.numberAddedColors_ < HeatmapBinding.MAX_NUMBER_COLORS) {
          parent.appendChild(html);
          this.setRandomColor(html);
          html.querySelector('.m-close').addEventListener('click', () => {
            let rootElement = html.parentElement;
            rootElement.removeChild(html);
            this.numberAddedColors_--;
          });
          this.numberAddedColors_++;
        }
        else {
          M.dialog.info("Ha llegado al número máximo de colores permitidos", "Información");
        }
      });
    });
  }

  /**
   * @function
   */
  setRandomColor(html) {
    let inputColor = html.querySelector("input");
    let randomColor = chroma.random().hex();
    inputColor.value = randomColor;
  }

  /**
   * This function generates the heatmap style.
   * @function
   * @returns {M.style.Heatmap}
   */
  generateStyle() {
    let opts = this.generateOptions();
    let style = null;
    if (opts.attributeName != "") {
      style = new M.style.Heatmap(opts.attributeName, opts.options);
    }
    return style;
  }

  /**
   * @function
   *
   */
  getOptionsTemplate() {
    let options = HeatmapBinding.DEFAULT_OPTIONS_STYLE;
    if (this.style_ != null) {
      options["attribute"] = this.style_.getAttributeName();
      options["radius"] = this.style_.getRadius();
      options["blur"] = this.style_.getBlurSize();
      options["gradient"] = this.style_.getGradient();

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

/**
 * @const
 */
HeatmapBinding.DEFAULT_OPTIONS_STYLE = {
  attribute: "",
  gradient: ["#0000ff", "#00ffff", "#00ff00", "#ffff00", "#ffb619", "#ff0000"],
  blur: 12,
  radius: 22
};

/**
 * @const
 */
HeatmapBinding.MAX_NUMBER_COLORS = 30;
