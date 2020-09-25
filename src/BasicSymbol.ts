import BasicString from "./BasicString";

class BasicSymbol extends BasicString {
  constructor(value) {
    super(value);
    this.dtype = 17;
  }
}

export default BasicSymbol;
