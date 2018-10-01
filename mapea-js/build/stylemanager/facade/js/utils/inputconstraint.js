export class InputConstraint {

  constructor(input, options) {
    if (input == null) {
      throw new Error('HTMLInputElement cannot be null or undefines.');
    }
    this.input_ = input;

    if (this.input_.type === "number") {
      this.min_ = options.min;
      this.max_ = options.max;
      this.precision_ = options.precision;
      this.empty_ = options.empty;

      this.input_.addEventListener('input', this.numberConstraint.bind(this));
    }
  }

  numberConstraint() {

    if (this.precision_ === "integer") {
      this.value_ = parseInt(this.input_.value);
    }

    if (this.precision_ === "float") {
      this.value_ = parseFloat(this.input_.value);
    }


    if ((this.value_ < this.min_)) {
      this.input_.value = this.min_;
    }

    if ((this.value_ > this.max_)) {
      this.input_.value = this.max_;

    }

    if (isNaN(this.value_)) {
      if (this.empty_ !== true) {
        this.input_.value = this.min_;
      }
    }

  }
}
