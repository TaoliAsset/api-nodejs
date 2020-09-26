import Util from "./util";

import BasicDate from "./BasicDate";
import BasicMonth from "./BasicMonth";
import BasicTime from "./BasicTime";
import BasicMinute from "./BasicMinute";
import BasicSecond from "./BasicSecond";
import BasicDateTime from "./BasicDateTime";
import BasicTimeStamp from "./BasicTimeStamp";
import BasicNanoTime from "./BasicNanoTime";
import BasicNanoTimeStamp from "./BasicNanoTimeStamp";
import BasicUuid from "./BasicUuid";
import BasicIpAddr from "./BasicIpAddr";
import BasicInt128 from "./BasicInt128";
import BasicNull from "./BasicNull";

class Parser {
  constructor(public isSmall = true) {}

  bytes2DType(bb, type) {
    const value;
    if (type === 0) {
      // void
      value = bb.readInt8();
      return null;
    } else if (type === 1) {
      // bool
      const boolNull = new BasicNull(1);
      value = bb.readInt8();
      if (boolNull.isNull(value)) return boolNull.get();
      return value === 1;
    } else if (type === 2) {
      // char
      const charNull = new BasicNull(2);
      value = bb.readInt8();
      if (charNull.isNull(value)) return charNull.get();
      return bb.slice(0, 1).toString();
    } else if (type === 3) {
      //short
      if (this.isSmall) value = bb.readInt16LE();
      else value = bb.readInt16BE();
    } else if (type === 4) {
      // int
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
    } else if (type === 5) {
      // long
      if (this.isSmall) value = bb.readBigInt64LE();
      else value = bb.readBigInt64BE();
    } else if (type === 6) {
      //return 'date'
      const value;
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
      const nullTimeObj = new BasicNull(6);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicDate(value);
    } else if (type === 7) {
      //return 'month'
      const value;
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
      const nullTimeObj = new BasicNull(7);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicMonth(value);
    } else if (type === 8) {
      //return 'time'
      const value;
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
      const nullTimeObj = new BasicNull(8);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicTime(value);
    } else if (type === 9) {
      //return 'minute'
      const value;
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
      const nullTimeObj = new BasicNull(9);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicMinute(value);
    } else if (type === 10) {
      //return 'second'
      const value;
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
      const nullTimeObj = new BasicNull(10);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicSecond(value);
    } else if (type === 11) {
      //return 'datetime'
      const value;
      if (this.isSmall) value = bb.readInt32LE();
      else value = bb.readInt32BE();
      const nullTimeObj = new BasicNull(11);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicDateTime(value);
    } else if (type === 12) {
      //return 'timestamp'
      const value;
      if (this.isSmall) value = bb.readBigInt64LE();
      else value = bb.readBigInt64BE();
      const nullTimeObj = new BasicNull(12);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicTimeStamp(value);
    } else if (type === 13) {
      //return 'nanotime'
      const value;
      if (this.isSmall) value = bb.readBigInt64LE();
      else value = bb.readBigInt64BE();
      const nullTimeObj = new BasicNull(13);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicNanoTime(value);
    } else if (type === 14) {
      //return 'nanotimestamp'
      const value;
      if (this.isSmall) value = bb.readBigInt64LE();
      else value = bb.readBigInt64BE();
      const nullTimeObj = new BasicNull(14);
      if (nullTimeObj.isNull(value)) return nullTimeObj.get();
      return new BasicNanoTimeStamp(value);
    } else if (type === 15) {
      //float
      if (this.isSmall) value = bb.readFloatLE();
      else value = bb.readFloatBE();
    } else if (type === 16) {
      //double
      if (this.isSmall) value = bb.readDoubleLE();
      else value = bb.readDoubleBE();
    } else if (type === 18 || type === 17) {
      // string and symbol
      const i;
      for (i = 0; i < bb.length && bb[i] !== 0; i++);
      if (this.isSmall) return bb.slice(0, i).toString();
      else return bb.slice(0, i).reverse().toString();
    } else if (type === 19) {
      // uuid
      const high, low;
      if (this.isSmall) {
        low = bb.readBigInt64LE();
        high = bb.readBigInt64LE(8);
      } else {
        high = bb.readBigInt64BE();
        low = bb.readBigInt64BE(8);
      }
      const uuid = new BasicUuid({ high: high, low: low });
      return uuid;
    } else if (type === 30) {
      // ipaddr
      const high, low;
      if (this.isSmall) {
        low = bb.readBigInt64LE();
        high = bb.readBigInt64LE(8);
      } else {
        high = bb.readBigInt64BE();
        low = bb.readBigInt64BE(8);
      }
      const ipaddr = new BasicIpAddr({ high: high, low: low });
      return ipaddr;
    } else if (type === 31) {
      // int128
      const high, low;
      if (this.isSmall) {
        low = bb.readBigInt64LE();
        high = bb.readBigInt64LE(8);
      } else {
        high = bb.readBigInt64BE();
        low = bb.readBigInt64BE(8);
      }
      const int128 = new BasicInt128({ high: high, low: low });
      return int128;
    } else {
      return null;
    }
    const nullObj = new BasicNull(type);
    if (nullObj.isNull(value)) return nullObj.get();
    return value;
  }

  parseVector(datavec) {
    const dt = datavec[0];
    const df = datavec[1]; // should be vector
    const nrow = this.bytes2DType(datavec.slice(2, 6), 4);
    const ncol = this.bytes2DType(datavec.slice(6, 10), 4);
    const v = new Array(ncol);
    for (const i = 0; i < ncol; i++) v[i] = new Array(nrow);
    const databuf = datavec.slice(10);
    // console.log(nrow, ncol)
    const s = Util.dtypelen(dt); //fixed length or null
    const se = 0; // slice index
    if (s === -1) {
      // no fixed length
      if (dt === 18 || dt === 17) {
        // string
        for (const j = 0; j < ncol; j++) {
          for (const i = 0; i < nrow; i++) {
            const ss = se;
            for (; se < databuf.length && databuf[se] !== 0; se++);
            const t = this.bytes2DType(databuf.slice(ss, se), dt);
            se++;
            v[j][i] = t;
          }
        }
      } else {
        // complex type
        for (const j = 0; j < ncol; j++) {
          for (const i = 0; i < nrow; i++) {
            const t = this.readPacket(databuf.slice(se));
            se += t._block_len;
            v[j][i] = t.value;
          }
        }
      }
    } else {
      for (const j = 0; j < ncol; j++) {
        for (const i = 0; i < nrow; i++) {
          const t = this.bytes2DType(databuf.slice(se, se + s), dt);
          se += s;
          v[j][i] = t;
        }
      }
    }

    return {
      arr: v, //vector
      sl: 10 + se, //slice length
    };
  }

  readPacket(rest) {
    // const buf = Buffer.from(rest);
    const buf = rest;
    const dt = buf[0]; //extract data type
    const df = buf[1]; //extract data form
    const databuf = buf.slice(2);

    // console.log('data length: '+ databuf.length)
    if (df === 0) {
      // scalar
      const c = this.bytes2DType(databuf, dt);
      return {
        value: c,
        _block_len: 2 + (dt === 18 ? c.length + 1 : Util.dtypelen(dt)),
      };
    } else if (df === 1) {
      // vetctor
      const v = this.parseVector(buf);
      return {
        value: v.arr[0],
        _block_len: v.sl,
      };
    } else if (df === 2) {
      // pair
      const v = this.parseVector(buf);
      return {
        value: v.arr[0],
        _block_len: v.sl,
      };
    } else if (df === 3) {
      // matrix
      const hasName = databuf[0] & 0x03;
      const clnm = null;
      const rnm = null;
      const blocklen = 0;
      const v;
      if (hasName === 0) {
        // no col and row name
        v = this.parseVector(databuf.slice(1));
        blocklen = v.sl;
      } else if (hasName === 1) {
        // has row name
        const rnv = this.parseVector(databuf.slice(1));
        v = this.parseVector(databuf.slice(1 + rnv.sl));
        rnm = rnv.arr[0];
        blocklen = rnv.sl + v.sl;
      } else if (hasName == 2) {
        // has col name
        const cnv = this.parseVector(databuf.slice(1));
        v = this.parseVector(databuf.slice(1 + cnv.sl));
        clnm = cnv.arr[0];
        blocklen = cnv.sl + v.sl;
      } else if (hasName == 3) {
        const rnv = this.parseVector(databuf.slice(1));
        const cnv = this.parseVector(databuf.slice(1 + rnv.sl));
        v = this.parseVector(databuf.slice(1 + rnv.sl + cnv.sl));
        rnm = rnv.arr[0];
        clnm = cnv.arr[0];
        blocklen = rnv.sl + cnv.sl + v.sl;
      }

      return {
        value: {
          rownames: rnm,
          colnames: clnm,
          data: v.arr,
        },
        _block_len: 3 + blocklen,
      };
    } else if (df === 4) {
      // set
      const v = this.parseVector(databuf);
      return {
        value: new Set(v.arr[0]),
        _block_len: 2 + v.sl,
      };
    } else if (df === 5) {
      // dictionary
      const v1 = this.parseVector(databuf);
      const kv = v1.arr[0]; // scalar type
      const v2 = this.parseVector(databuf.slice(v1.sl));
      const vv = v2.arr[0]; // any object
      const m = new Map();
      for (const i = 0; i < kv.length; i++) m.set(kv[i], vv[i]);
      return {
        value: m,
        _block_len: 2 + v1.sl + v2.sl,
      };
    } else if (df === 6) {
      // table
      const nrow = this.bytes2DType(databuf.slice(0, 4), 4);
      const ncol = this.bytes2DType(databuf.slice(4, 8), 4);
      const i;
      for (i = 8; i < databuf.length && databuf[i] !== 0; i++);
      const tbname = this.bytes2DType(databuf.slice(8, i), 18);
      const clnames = new Array(ncol);
      const se = ++i;
      for (const j = 0; j < ncol; j++) {
        const s = se;
        for (; se < databuf.length && databuf[se] !== 0; se++);
        const t = this.bytes2DType(databuf.slice(s, se), 18);
        se++;
        clnames[j] = t;
      }
      const tbdata = new Array(ncol);
      for (const j = 0; j < ncol; j++) {
        const v = this.parseVector(databuf.slice(se));
        tbdata[j] = v.arr[0];
        se += v.sl;
      }
      return {
        value: {
          tablename: tbname,
          colnames: clnames,
          data: tbdata,
        },
        _block_len: 2 + se,
      };
    } else if (df === 7) {
      return "get Chart";
    } else if (df === 8) {
      return "get Chunck";
    } else {
      return "unknown data form";
    }
  }
}
export default Parser;
