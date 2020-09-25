import VectorCheck from "./VectorCheck";

class TableCheck {
  hlen = 10;
  dt = 0;
  df = 6;
  isful = false;
  state = 0;
  offset = 0;
  ncol = 0;
  nrow = 0;
  arr = null;
  pos = 0;
  colpos = 0;

  constructor(public isSmall = true) {}
  init(isSmall = true) {
    this.isSmall = isSmall;
    this.dt = 0;
    this.df = 6;
    this.isful = false;
    this.state = 0;
    this.offset = 0;
    this.ncol = 0;
    this.nrow = 0;
    this.arr = null;
    this.pos = 0;
    this.colpos = 0;
    return this;
  }
  readInt(bs) {
    if (this.isSmall) return bs.readInt32LE();
    else return bs.readInt32BE();
  }
  isFull() {
    return this.isful;
  }
  check(data) {
    let cbuf = data;
    while (true) {
      if (this.state === 0) {
        if (cbuf.length < this.hlen) return cbuf;
        this.dt = data[0];
        this.df = data[1];
        this.nrow = this.readInt(cbuf.slice(2));
        this.ncol = this.readInt(cbuf.slice(6));
        this.offset += this.hlen;
        this.state = 1;
        cbuf = cbuf.slice(this.hlen);
        if (cbuf.length === 0) break;
      } else if (this.state === 1) {
        // table name;
        let j;
        for (j = 0; j < cbuf.length && cbuf[j] !== 0; j++);
        if (j === cbuf.length) return cbuf;
        j++;
        this.state = 2;
        this.offset += j;
        cbuf = cbuf.slice(j);
        if (cbuf.length === 0) break;
      } else if (this.state === 2) {
        // colnames;
        for (let i = this.colpos; i < this.ncol; i++) {
          let j = 0;
          for (; j < cbuf.length && cbuf[j] !== 0; j++);
          if (j === cbuf.length) {
            this.colpos = i;
            return cbuf;
          }
          j++;
          this.offset += j;
          cbuf = cbuf.slice(j);
        }
        this.state = 3;
        if (cbuf.length === 0) break;
      } else if (this.state === 3) {
        // cols
        if (this.arr === null) {
          this.arr = new Array(this.ncol);
          for (let i = 0; i < this.ncol; i++) this.arr[i] = null;
        }
        for (let i = this.pos; i < this.ncol; i++) {
          if (this.arr[i] === null)
            this.arr[i] = new VectorCheck().init(this.isSmall);
          let vc = this.arr[i];
          let offset = vc.offset;
          let re = vc.check(cbuf);
          this.offset += vc.offset - offset;
          if (vc.isFull()) {
            // this.offset += vc.offset;
            cbuf = cbuf.slice(vc.offset - offset);
          } else {
            this.pos = i;
            return re;
          }
        }
        this.isful = true;
        return cbuf;
      }
    }
  }
}
export default TableCheck;
