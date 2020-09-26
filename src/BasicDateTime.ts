import Util from "./util";
import constants from "./constants";

import BasicDate from "./BasicDate";
import BasicTime from "./BasicTime";
import TimeObj from "./TimeObj";
const basicDate = new BasicDate(undefined);
const basicTime = new BasicTime(undefined);

class BasicDateTime extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 11;
    if (value != null) {
      if (typeof value === "number") {
        this.value = value;
        this.timeObj = this.parseInt(value);
      } else if (typeof value === "string") {
        const { year, month, day, hour, minute, second } = Util.timeFromStr(
          value
        );
        this.timeObj = {
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: second,
        };
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
    const days = Math.floor(value / 86400);
    const date = basicDate.parseInt(days);
    const sec = value % 86400;
    if (sec < 0) sec += 86400;
    const time = basicTime.parseInt(sec * 1000);
    return {
      year: date.year,
      month: date.month,
      day: date.day,
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      toString: function () {
        return `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`;
      },
    };
  }

  parseObj(datetimeObj) {
    const { year, month, day, hour, minute, second } = datetimeObj;
    const days = basicDate.parseObj({ year: year, month: month, day: day });
    return days * 86400 + hour * 3600 + minute * 60 + second;
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
export default BasicDateTime;
