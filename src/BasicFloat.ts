import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicFloat extends BasicScalar {
  constructor(value) {
    super();
    this.dtype = 15;
    this.value = value == null ? constants.floatMin : value;
  }
  tobytes() {
    const buf = Buffer.alloc(4);
    if (this.isSmall) buf.writeFloatLE(this.value);
    else buf.writeFloatBE(this.value);
    return buf;
  }
}
export default BasicFloat;
