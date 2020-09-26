// import Util from "./util";
import tUtil from "./typeUtil";
import constants from "./constants";

import BasicScalar from "./BasicScalar";
// import BasicNull from "./BasicNull";
import BasicInt from "./BasicInt";
// import BasicString from "./BasicString";

class BasicVector {
  dform = 1;
  dt: number;
  constructor(public value) {
    this.dt = this.elementDtype();
  }
  elementDtype() {
    if (this.value == null) return -1;
    if (this.value.length == 0) return 25;
    const dt = -1;
    const v = this.value;
    for (const i = 0; i < v.length; i++) {
      if (v[i] instanceof BasicScalar) {
        if (dt === -1) dt = v[i].dtype;
        else if (dt !== v[i].dtype) {
          dt = 25; //any
          break;
        }
      } else {
        const dtr = tUtil.scalarTypeR(v[i]);
        if (dtr === -1) {
          dt = 25;
          break;
        }
        if (dt === -1) dt = dtr;
        else if (dt !== dtr) {
          dt = 25;
          break;
        }
      }
    }
    return dt;
  }
  tobytes() {
    const dt = this.dt;
    if (dt !== -1) {
      const buf;
      const byteArray = new Array();
      const v = this.value;
      byteArray.push(dt, 1); // vector header
      const nrowbuf = new BasicInt(v.length).tobytes();
      const ncolbuf = new BasicInt(1).tobytes();
      for (const e of nrowbuf) byteArray.push(e);
      for (const e of ncolbuf) byteArray.push(e);

      if (dt !== 25) {
        // scalar
        for (const i = 0; i < v.length; i++) {
          buf = tUtil.scalar2BufR(v[i], { header: false, dt: dt });
          for (const e of buf) byteArray.push(e);
        }
      } else {
        // any
        for (const i = 0; i < v.length; i++) {
          if (v[i] instanceof Array) {
            buf = new BasicVector(v[i]).tobytes();
          } else {
            buf = tUtil.scalar2BufR(v[i], { header: true });
            if (buf === null) buf = v[i].tobytes();
          }
          for (const e of buf) byteArray.push(e);
        }
      }
      return Buffer.from(byteArray);
    } else {
      return Buffer.from([0, 0, constants.nullV]);
    }
  }
}
export default BasicVector;
