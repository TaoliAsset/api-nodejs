import BasicScalar from "./BasicScalar";
import constants from "./constants";

class BasicString extends BasicScalar {
  constructor(value) {
    super();
    this.value = value;
    this.dtype = 18;
  }
  tobytes() {
    if (this.value == null) return Buffer.from([0, 0, constants.nullV]);
    const str = this.value;
    const buf = Buffer.alloc(str.length + 1);
    if (!this.isSmall) str = str.split("").reverse().join("");
    buf.write(str);
    return buf;
  }
}

export default BasicString;
