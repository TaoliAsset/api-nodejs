import Util from "./util";
import constants from "./constants";

import BasicDate from "./BasicDate";
import BasicTime from "./BasicTime";
import TimeObj from "./TimeObj";
let basicDate = new BasicDate();
let basicTime = new BasicTime();

class BasicTimeStamp extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 12;
    if (value != null) {
      if (typeof value === "bigint") {
        this.value = value;
        this.timeObj = this.parseLong(value);
      } else if (typeof value === "string") {
        let { year, month, day, hour, minute, second, nS } = Util.timeFromStr(
          value
        );
        this.timeObj = {
          date: { year: year, month: month, day: day },
          time: { hour: hour, minute: minute, second: second, nanoSecond: nS },
        };
        this.value = this.parseObj(this.timeObj);
      } else if (typeof value === "object") {
        this.timeObj = value;
        this.value = this.parseObj(value);
      }
    } else {
      this.value = constants.longMin;
    }
  }

  clear() {
    this.timeObj.date = null;
    this.timeObj.time = null;
    this.timeObj = null;
  }

  parseLong(value) {
    let days = Number(value / 86400000n);
    if (value < 0n && value % 86400000n !== 0n) days -= 1;
    let date = basicDate.parseInt(days);
    let mss = Number(value % 86400000n);
    if (mss < 0) mss += 86400000;
    let time = basicTime.parseInt(mss);
    return {
      date: date,
      time: time,
    };
  }

  parseObj(timeStampObj) {
    let { date, time } = timeStampObj;
    let days = basicDate.parseObj(date);
    let ms = basicTime.parseObj(time);
    return BigInt(days) * 86400000n + BigInt(ms);
  }

  get() {
    return this.timeObj;
  }

  tobytes() {
    let buf = Buffer.alloc(8);
    if (this.isSmall) buf.writeBigInt64LE(this.value);
    else buf.writeBigInt64BE(this.value);
    return buf;
  }

  toString() {
    return this.timeObj.date.toString() + " " + this.timeObj.time.toString();
  }
}
export default BasicTimeStamp;
