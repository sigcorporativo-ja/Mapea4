import {
  Binding
}
from './binding';

export class ClusterBinding extends Binding {
  constructor(html, htmlParent, styleType, styleParams, layer) {
    super(html, htmlParent, styleType, styleParams, layer);
    this.compilePromise_.then(() => {
      this.addEventRangeListener();
      this.addPaginationListener();
    });
  }

  /**
   * This function sets the attribute layer to the binding.
   * @function
   * @param {M.layer.Vector}
   */
  setLayer(layer) {
    this.layer_ = layer;
    return this;
  }

  /**
   * This function generates the options style from his own html form.
   *
   * @function
   * @api stable
   */
  generateOptions() {
    let styleOpts = {};
    styleOpts["options"] = {};
    styleOpts["ranges"] = {};

    // styleOpts.options section
    this.querySelectorAllForEach("[data-style-options]", element => {
      let prop = element.dataset["styleOptions"];
      let value = element.value;
      if (element.type === "checkbox") {
        value = element.checked;
      }

      if (element.type === "number") {
        value = parseFloat(value);
      }

      if (prop === "label.color") {
        styleOpts["options"]["label"] = {};
        styleOpts["options"]["label"]["color"] = value;

      }
      else {
        styleOpts["options"][prop] = value;
      }

    });

    // Ranges cluster section
    this.querySelectorAllForEach("[data-ranges-id][data-apply-range]", element => {
      let id = element.dataset["rangesId"];
      if (styleOpts["ranges"][id] == undefined) {
        styleOpts["ranges"][id] = {};
      }
      let path = element.dataset["rangesOptions"];
      let value = element.value;

      if (element.type === "number") {
        value = parseFloat(value);
      }

      Binding.createObj(styleOpts["ranges"][id], path, value);
    });

    styleOpts["ranges"] = Object.values(styleOpts["ranges"]).filter(option => !isNaN(option["minRange"]) && !isNaN(option["maxRange"]));
    return styleOpts;
  }

  /**
   * This function generates the cluster style from GUI Options.
   *
   * @function
   * @returns {M.style.Cluster}
   */
  generateStyle() {
    let opts = this.generateOptions();
    let optsRanges = [...opts.ranges];
    let ranges = optsRanges.map(obj => {
      return {
        min: obj["minRange"],
        max: obj["maxRange"],
        style: new M.style.Point(obj["style"])
      };
    });
    opts.options["ranges"] = ranges;
    return new M.style.Cluster(opts.options, {
      distanceSelectFeatures: opts.options.distanceSelectFeatures
    });
  }

  /**
   * This function sets the number of cluster ranges.
   *
   * @function
   */
  setRanges() {
    let rangesInput = this.querySelector("[data-number-ranges]");
    let numRanges = parseInt(rangesInput.value);
    if (numRanges > 0 && numRanges < ClusterBinding.NUMBER_RANGES) {

      for (let i = 1; i < numRanges + 1; i++) {
        let pagerElement = this.querySelector(`[data-page-selector="${i}"]`);
        pagerElement.classList.remove("m-hidden");
        this.querySelectorAllForEach(`[data-ranges-id="${i}"]`, element => {
          element.setAttribute("data-apply-range", "");
        });
      }

      for (let i = numRanges + 1; i < ClusterBinding.NUMBER_RANGES; i++) {
        let pagerElement = this.querySelector(`[data-page-selector="${i}"]`);
        pagerElement.classList.add("m-hidden");
        this.querySelectorAllForEach(`[data-ranges-id="${i}"]`, element => {
          element.removeAttribute("data-apply-range");
        });
      }

      let pagerElement = this.querySelector(`[data-page-selector="${numRanges}"]`);
      this.paginationListener(pagerElement)();

    }
  }

  /**
   * This function activate the page selector passed by parameter.
   *
   * @function
   * @param {HTMLElement}
   */
  paginationListener(element) {
    return () => {
      let oldElement = this.querySelector("[data-page-active]");
      if (oldElement != null) {
        oldElement.removeAttribute("data-page-active");
        oldElement.classList.remove('m-page-active');
        let oldId = oldElement.dataset["pageSelector"];
        let oldRange = this.querySelector(`[data-page='${oldId}']`);
        if (oldRange != null) {
          oldRange.classList.add('m-hidden');
        }
      }

      if (element != null) {
        element.classList.add('m-page-active');
        element.dataset["pageActive"] = "";
        let id = element.dataset["pageSelector"];
        let newRange = this.querySelector(`[data-page='${id}']`);
        newRange.classList.remove('m-hidden');
      }
    };
  }

  /**
   * TODO
   */
  addEventRangeListener() {
    let rangesInput = this.querySelector("[data-number-ranges]");
    rangesInput.addEventListener('input', this.setRanges.bind(this));
  }

  /**
   * TODO
   */
  addPaginationListener() {
    this.querySelectorAllForEach("[data-page-selector]", element => {
      element.addEventListener('click', this.paginationListener(element).bind(this));
    });
  }

  /**
   * @function
   *
   */
  getOptionsTemplate() {
    let options = Object.assign({}, ClusterBinding.DEFAULT_OPTIONS_STYLE);
    if (this.style_ != null) {
      options = Object.assign({}, this.style_.getOptions());
      let ranges = options["ranges"].filter(range => !isNaN(range["min"])).map(rangeOpt => {
        let obj = {};
        let style = rangeOpt["style"];
        obj["min"] = rangeOpt["min"];
        obj["max"] = rangeOpt["max"];
        obj["fill"] = style.get("fill.color");
        obj["stroke"] = style.get("stroke.color");
        obj["width"] = style.get("stroke.width");
        obj["opacity"] = style.get("fill.opacity") == null ? 1 : style.get("fill.opacity");
        obj["radius"] = style.get("radius");
        return obj;
      });
      options["ranges"] = ranges;
    }

    //generator function
    const range = (n, m, lastRange) => {
      const ranges = [];
      let max = lastRange;
      for (let i = n; i < m; i++) {
        let min = max + 1;
        max = min + 200;
        const obj = {
          id: i,
          min: min,
          max: max,
          fill: chroma.random().hex(),
          stroke: chroma.random().hex()
        };
        ranges.push(obj);
      }
      return ranges;
    };

    // generates
    let lastRange = options["ranges"].slice(-1)[0]["max"];
    options["pages"] = [];
    const ranges = range(options["ranges"].length + 1, ClusterBinding.NUMBER_RANGES, lastRange);
    ranges.forEach((element, index) => {
      options["pages"].push(element);
    });
    return options;
  }
}

/**
 * Maximum number of cluster ranges allowed.
 *
 * @const
 */
ClusterBinding.NUMBER_RANGES = 13;

/**
 *
 * @const
 */
ClusterBinding.DEFAULT_OPTIONS_STYLE = {
  hoverInteraction: true,
  displayAmount: true,
  selectInteraction: true,
  animated: true,
  distance: 30,
  label: {
    color: "#4dfeef"
  },
  maxFeaturesToSelect: 20,
  distanceSelectFeatures: 15,
  ranges: [
    {
      min: 2,
      max: 30,
      fill: "#ff00ff",
      stroke: "#00fef0",
      width: 2,
      opacity: 1
    }
  ]
};
