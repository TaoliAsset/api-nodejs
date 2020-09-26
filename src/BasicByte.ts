import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicByte extends BasicScalar {
  dtype = 2;
  constructor(value: number) {
    super();
    this.value = value ?? constants.byteMin;
  }
  tobytes() {
    const buf = Buffer.alloc(1);
    buf.writeInt8(this.value);
    return buf;
  }
}
export default BasicByte;
