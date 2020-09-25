import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicInt extends BasicScalar {
  constructor(value) {
    super();
    this.dtype = 4;
    this.value = value == null ? constants.intMin : value;
  }
  tobytes() {
    let buf = Buffer.alloc(4);
    if (this.isSmall) buf.writeInt32LE(this.value);
    else buf.writeInt32BE(this.value);
    return buf;
  }
}
export default BasicInt;
