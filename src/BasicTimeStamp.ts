import Util from "./util";
import constants from "./constants";

import BasicDate from "./BasicDate";
import BasicTime from "./BasicTime";
import TimeObj from "./TimeObj";
const basicDate = new BasicDate(null);
const basicTime = new BasicTime(null);

class BasicTimeStamp extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 12;
    if (value != null) {
      if (typeof value === "bigint") {
        this.value = value;
        this.timeObj = this.parseLong(value);
      } else if (typeof value === "string") {
        const { year, month, day, hour, minute, second, nS } = Util.timeFromStr(
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
    const days = Number(value / 86400000n);
    if (value < 0n && value % 86400000n !== 0n) days -= 1;
    const date = basicDate.parseInt(days);
    const mss = Number(value % 86400000n);
    if (mss < 0) mss += 86400000;
    const time = basicTime.parseInt(mss);
    return {
      date: date,
      time: time,
    };
  }

  parseObj(timeStampObj) {
    const { date, time } = timeStampObj;
    const days = basicDate.parseObj(date);
    const ms = basicTime.parseObj(time);
    return BigInt(days) * 86400000n + BigInt(ms);
  }

  get() {
    return this.timeObj;
  }

  tobytes() {
    const buf = Buffer.alloc(8);
    if (this.isSmall) buf.writeBigInt64LE(this.value);
    else buf.writeBigInt64BE(this.value);
    return buf;
  }

  toString() {
    return this.timeObj.date.toString() + " " + this.timeObj.time.toString();
  }
}
export default BasicTimeStamp;
