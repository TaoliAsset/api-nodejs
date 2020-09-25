import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicShort extends BasicScalar {
  constructor(value) {
    super();
    this.dtype = 3;
    this.value = value == null ? constants.shortMin : value;
  }
  tobytes() {
    let buf = Buffer.alloc(2);
    if (this.isSmall) buf.writeInt16LE(this.value);
    else buf.writeInt16BE(this.value);
    return buf;
  }
}
export default BasicShort;
