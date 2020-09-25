import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicDouble extends BasicScalar {
  constructor(value) {
    super();
    this.dtype = 16;
    this.value = value == null ? constants.doubleMin : value;
  }
  tobytes() {
    let buf = Buffer.alloc(8);
    if (this.isSmall) buf.writeDoubleLE(this.value);
    else buf.writeDoubleBE(this.value);
    return buf;
  }
}
export default BasicDouble;
