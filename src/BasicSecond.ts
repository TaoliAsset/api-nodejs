import Util from "./util";
import constants from "./constants";

import TimeObj from "./TimeObj";

class BasicSecond extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 10;
    if (value != null) {
      if (typeof value === "number") {
        this.value = value;
        this.timeObj = this.parseInt(value);
      } else if (typeof value === "string") {
        const { hour, minute, second } = Util.timeFromStr(value);
        this.timeObj = { hour: hour, minute: minute, second: second };
        this.value = this.parseObj(this.timeObj);
      } else if (typeof value === "object") {
        this.timeObj = value;
        this.value = this.parseObj(value);
      }
    } else {
      this.value = constants.intMin;
    }
  }

  parseInt(value) {
    const hour, minute, second;
    hour = Math.floor(value / 3600);
    minute = Math.floor((value % 3600) / 60);
    second = value % 60;
    return {
      hour: hour,
      minute: minute,
      second: second,
      toString: function () {
        return `${this.hour}:${this.minute}:${this.second}`;
      },
    };
  }

  parseObj(secondObj) {
    const { hour, minute, second } = secondObj;
    return hour * 3600 + minute * 60 + second;
  }

  get() {
    return this.timeObj;
  }

  tobytes() {
    const buf = Buffer.alloc(4);
    if (this.isSmall) buf.writeInt32LE(this.value);
    else buf.writeInt32BE(this.value);
    return buf;
  }

  // toString() {
  //     return this.timeObj.toString();
  // }
}
export default BasicSecond;
