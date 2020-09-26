import Util from "./util";
import constants from "./constants";

import TimeObj from "./TimeObj";

class BasicMinute extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 9;
    if (value != null) {
      if (typeof value === "number") {
        this.value = value;
        this.timeObj = this.parseInt(value);
      } else if (typeof value === "string") {
        const { hour, minute } = Util.timeFromStr(value);
        this.timeObj = { hour: hour, minute: minute };
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
    const hour, minute;
    hour = Math.floor(value / 60);
    minute = value % 60;
    return {
      hour: hour,
      minute: minute,
      toString: function () {
        return `${this.hour}:${this.minute}`;
      },
    };
  }

  parseObj(minuteObj) {
    const { hour, minute } = minuteObj;
    return hour * 60 + minute;
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
export default BasicMinute;
