import BasicScalar from "./BasicScalar";
import BasicBool from "./BasicBool";
import BasicDouble from "./BasicDouble";
import BasicString from "./BasicString";
import BasicLong from "./BasicLong";
import BasicInt from "./BasicInt";
import BasicNull from "./BasicNull";

namespace tUtil {
  export function scalarTypeR(value) {
    if (value instanceof BasicScalar) return value.dtype;
    if (value === null) return 0;
    if (typeof value === "boolean") return 1;
    if (typeof value === "number") {
      if (value.toString().indexOf(".") !== -1) return 16;
      else return 4;
    }
    if (typeof value === "string") return 18;
    if (typeof value === "bigint") return 5;
    return -1;
  }

  export function scalar2BufR(value, options) {
    const { isSmall = true, header = false, dt = -1 } = options;
    const scalarObj = null;
    if (value instanceof BasicScalar) {
      scalarObj = value;
    } else {
      const dtr;
      if (dt !== -1) dtr = dt;
      else dtr = tUtil.scalarTypeR(value);
      if (dtr === 0) {
        scalarObj = new BasicNull(0);
      }
      if (dtr === 1) {
        scalarObj = new BasicBool(value);
      } else if (dtr === 4) {
        scalarObj = new BasicInt(value);
      } else if (dtr === 16) {
        scalarObj = new BasicDouble(value);
      } else if (dtr === 18 || dtr === 17) {
        scalarObj = new BasicString(value);
      } else if (dtr === 5) {
        scalarObj = new BasicLong(value);
      }
    }
    if (scalarObj !== null) {
      const buf = scalarObj.small(isSmall).tobytes();
      if (header) buf = Buffer.concat([scalarObj.hdrbytes(), buf]);
      return buf;
    } else {
      return null;
    }
  }
}

export default tUtil;
