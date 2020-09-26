import BasicVector from "./BasicVector";
// import Util from "./util";
// import BasicNull from "./BasicNull";

class BasicSet extends BasicVector {
  constructor(value) {
    if (value == null || !(value instanceof Set)) super(null);
    else super(Array.from(value));
    // this.value = value;
    this.dform = 4;
  }
  tobytes() {
    const dt = this.dt;
    if (dt !== -1 && dt !== 1 && dt !== 25) {
      const buf = super.tobytes();
      const hdr = Buffer.from([this.dt, this.dform]);
      return Buffer.concat([hdr, buf], hdr.length + buf.length);
    } else if (dt === -1) {
      return super.tobytes();
    } else {
      console.log(
        "The key type can't be VOID, BOOL, FUNCTIONDEF, HANDLE, ANY or DICTIONARY"
      );
      return Buffer.from([0, 0, 0]);
    }
  }
}
export default BasicSet;
