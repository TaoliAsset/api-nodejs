import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicByte extends BasicScalar {
  constructor(value) {
    super();
    this.value = value == null ? constants.byteMin : value;
    this.dtype = 2;
  }
  tobytes() {
    let buf = Buffer.alloc(1);
    buf.writeInt8(this.value);
    return buf;
  }
}
export default BasicByte;
