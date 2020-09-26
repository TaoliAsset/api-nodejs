import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicLong extends BasicScalar {
  dtype = 5;
  value: bigint;

  constructor(value) {
    super();
    this.value = BigInt(value ?? constants.longMin);
  }
  tobytes() {
    const buf = Buffer.alloc(8);
    if (this.isSmall) buf.writeBigInt64LE(this.value);
    else buf.writeBigInt64BE(this.value);
    return buf;
  }
}
export default BasicLong;
