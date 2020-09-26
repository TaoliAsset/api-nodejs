import TableCheck from "./TableCheck";
import VectorCheck from "./VectorCheck";

class StreamReader {
  hlen = 17;
  msgid = 0n;
  state = 0;
  buf = null;
  topic = null;
  nrow2r = 0;
  nrow = 0;
  ncol = 0;
  df = 1;
  dt = -1;
  offset = 0;
  pdata = 0;
  tc = null;
  vc = null;
  isful = false;

  constructor(public isSmall = true) {}

  init() {
    this.isSmall = true;
    this.state = 0;
    this.buf = null;
    this.topic = null;
    this.nrow2r = 0;
    this.nrow = 0;
    this.ncol = 0;
    this.df = 1;
    this.dt = -1;
    this.offset = 0;
    this.pdata = 0;
    this.tc = null;
    this.vc = null;
    this.isful = false;
    return this;
  }
  readInt(bs) {
    if (this.isSmall) return bs.readInt32LE();
    else return bs.readInt32BE();
  }
  readLong(bs) {
    if (this.isSmall) return bs.readBigInt64LE();
    else return bs.readBigInt64BE();
  }
  readString(bs, end) {
    if (this.isSmall) return bs.slice(0, end).toString();
    else return bs.slice(0, end).reverse().toString();
  }
  isFull() {
    return this.isful;
  }
  read(data) {
    const cbuf = data;
    if (this.buf != null) cbuf = Buffer.concat([this.buf, cbuf]);
    while (true) {
      if (this.state === 0) {
        if (cbuf.length < this.hlen) {
          this.buf = cbuf;
          // console.log('incomplete stream header');
          break;
        }
        this.buf = null;
        this.isSmall = cbuf[0] === 1;
        const _x = this.readLong(cbuf.slice(1));
        const msgid = this.readLong(cbuf.slice(9));
        this.nrow2r = Number(msgid - this.msgid);
        this.msgid = msgid;
        this.offset += this.hlen;
        this.state = 1;
        cbuf = cbuf.slice(this.hlen);
        if (cbuf.length === 0) break;
      } else if (this.state === 1) {
        //topic
        const j = 0;
        for (; j < cbuf.length && cbuf[j] !== 0; j++);
        if (j === cbuf.length) {
          this.buf = cbuf;
          // console.log('incomplete topic');
          break;
        }
        this.topic = this.readString(cbuf, j);
        ++j;
        this.buf = null;
        this.state = 2;
        this.offset += j;
        this.pdata = this.offset;
        cbuf = cbuf.slice(j);
        if (cbuf.length === 0) break;
      } else if (this.state === 2) {
        if (cbuf.length < 10) {
          this.buf = cbuf;
          // console.log('incomplete common header');
          break;
        }
        this.buf = null;
        this.dt = cbuf[0];
        this.df = cbuf[1];
        this.nrow = this.readInt(cbuf.slice(2));
        this.ncol = this.readInt(cbuf.slice(6));
        if (this.df === 6 && this.nrow === 0) {
          this.state = 3;
        } else if (this.df === 1) {
          this.state = 4;
        } else {
          // this.state = -1; //error
          throw new Error(
            "message body has an invalid format. Vector or table is expected"
          );
          // return cbuf;
        }
      } else if (this.state === 3) {
        if (this.tc === null) this.tc = new TableCheck().init(this.isSmall);
        const tc = this.tc;
        const offset = tc.offset;
        const re = tc.check(cbuf);
        this.offset += tc.offset - offset;
        if (tc.isFull()) {
          --this.msgid;
          this.nrow2r = 0;
          this.isful = true;
          this.buf = null;
          cbuf = cbuf.slice(tc.offset - offset);
          return cbuf;
        } else {
          this.buf = re;
          // console.log('incomplete table data');
          break;
        }
      } else if (this.state === 4) {
        if (this.vc === null) this.vc = new VectorCheck().init(this.isSmall);
        const vc = this.vc;
        const offset = vc.offset;
        const re = vc.check(cbuf);
        this.offset += vc.offset - offset;
        if (vc.isFull()) {
          // this.offset += vc.offset;
          this.isful = true;
          this.buf = null;
          cbuf = cbuf.slice(vc.offset - offset);
          return cbuf;
        } else {
          this.buf = re;
          // console.log('incomplete vector data');
          break;
        }
      }
    }
  }
}
export default StreamReader;
