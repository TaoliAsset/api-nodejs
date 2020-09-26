import BasicVector from "./BasicVector";

class BasicPair extends BasicVector {
  constructor(value) {
    // a:b
    if (value == null) super(null);
    else {
      const i = value.indexOf(":");
      const a = Number(value.substring(0, i));
      const b = Number(value.substring(i + 1));
      super([a, b]);
    }
    this.dform = 2;
  }
}
export default BasicPair;
