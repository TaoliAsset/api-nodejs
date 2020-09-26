import Util from "./util";
import constants from "./constants";

import TimeObj from "./TimeObj";

class BasicNanoTime extends TimeObj {
  constructor(value) {
    super();
    this.dtype = 13;
    if (value != null) {
      if (typeof value === "bigint") {
        this.value = value;
        this.timeObj = this.parseLong(value);
      } else if (typeof value === "string") {
        const { hour, minute, second, nS } = Util.timeFromStr(value);
        this.timeObj = {
          hour: hour,
          minute: minute,
          second: second,
          nanoSecond: nS,
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

  parseLong(value) {
    const hour, minute, second, nanoSecond;
    const nsperhour = 3600000000000n;
    const nsperminute = 60000000000n;
    const nspersecond = 1000000000n;
    const bighours = value / nsperhour;
    value -= bighours * nsperhour;
    const bigminutes = value / nsperminute;
    value -= bigminutes * nsperminute;
    const bigseconds = value / nspersecond;
    value -= bigseconds * nspersecond;
    hour = Number(bighours);
    minute = Number(bigminutes);
    second = Number(bigseconds);
    nanoSecond = Number(value);
    return {
      hour: hour,
      minute: minute,
      second: second,
      nanoSecond: nanoSecond,
      toString: function () {
        return `${this.hour}:${this.minute}:${this.second}.${this.nanoSecond}ns`;
      },
    };
  }

  parseObj(nanoTimeObj) {
    const { hour, minute, second, nanoSecond } = nanoTimeObj;
    const nsperhour = 3600000000000n;
    const nsperminute = 60000000000n;
    const nspersecond = 1000000000n;
    const [bighour, bigminute, bigsecond, bignano] = [
      BigInt(hour),
      BigInt(minute),
      BigInt(second),
      BigInt(nanoSecond),
    ];
    return (
      bighour * nsperhour +
      bigminute * nsperminute +
      bigsecond * nspersecond +
      bignano
    );
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

  // toString() {
  //     return this.timeObj.toString();
  // }
}
export default BasicNanoTime;
