import Util from "./util";
import constants from "./constants";

import BasicDate from "./BasicDate";
import BasicNanoTime from "./BasicNanoTime";
import TimeObj from "./TimeObj";

let basicDate = new BasicDate();
let basicNanoTime = new BasicNanoTime();

class BasicNanoTimeStamp extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 14;
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
    const nsperday = 86400000000000n;
    let bigdays = value / nsperday;
    let bignanos = value % nsperday;
    if (value < 0n && bignanos !== 0n) bigdays -= 1n;
    let date = basicDate.parseInt(Number(bigdays));
    if (bignanos < 0n) bignanos += nsperday;
    let time = basicNanoTime.parseLong(bignanos);

    return {
      date: date,
      time: time,
    };
  }

  parseObj(nanoTimeStampObj) {
    const nsperday = 86400000000000n;
    let { date, time } = nanoTimeStampObj;
    let days = basicDate.parseObj(date);
    let nanos = basicNanoTime.parseObj(time);
    return BigInt(days) * nsperday + nanos;
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
export default BasicNanoTimeStamp;
