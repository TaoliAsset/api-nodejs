import Util from "./util";
import tUtil from "./typeUtil";
import BasicVector from "./BasicVector";
import BasicInt from "./BasicInt";

class BasicMat extends BasicVector {
  rownames;
  colnames;
  constructor(value) {
    if (value == null) super(null);
    else {
      const { rownames, colnames, type, data } = value;
      super(data);
      this.rownames = rownames;
      this.colnames = colnames;
      if (type != null && typeof type === "string")
        this.dt = Util.dtypeByName(type);
    }
    this.dform = 3;
  }
  elementDtype() {
    const dt = -1;
    const data = this.value;
    for (const j = 0; j < data.length; j++) {
      const e;
      if (!(data[j] instanceof Array)) e = data[j];
      else e = data[j][0];
      const dtr = tUtil.scalarTypeR(e);
      if (dtr === -1) {
        dt = -1;
        break;
      }
      if (dt === -1) dt = dtr;
      else if (Util.dtypelen(dtr) > Util.dtypelen(dt)) {
        dt = dtr;
      }
    }
    return dt;
  }
  tobytes() {
    const dt = this.dt;
    const byteArray = new Array();
    if (dt !== -1) {
      byteArray.push(dt, this.dform);
      if (this.rownames == null || this.rownames.length === 0) {
        if (this.colnames == null || this.colnames.length === 0)
          byteArray.push(0);
        else {
          byteArray.push(2);
          const colnamebuf = new BasicVector(this.colnames).tobytes();
          for (const e of colnamebuf) byteArray.push(e);
        }
      } else {
        if (this.colnames == null || this.colnames.length === 0) {
          byteArray.push(1);
          const rownamebuf = new BasicVector(this.rownames).tobytes();
          for (const e of rownamebuf) byteArray.push(e);
        } else {
          byteArray.push(3);
          const rownamebuf = new BasicVector(this.rownames).tobytes();
          const colnamebuf = new BasicVector(this.colnames).tobytes();
          for (const e of rownamebuf) byteArray.push(e);
          for (const e of colnamebuf) byteArray.push(e);
        }
      }
      // const databuf = super.tobytes();
      const data = this.value;
      byteArray.push(dt, this.dform);
      const ncol, nrow;
      if (data.length == 0) {
        ncol = 0;
        nrow = 1;
      } else if (!(data[0] instanceof Array)) {
        ncol = 1;
        nrow = data.length;
      } else {
        ncol = data.length;
        nrow = data[0].length;
      }
      const nrowbuf = new BasicInt(nrow).tobytes();
      const ncolbuf = new BasicInt(ncol).tobytes();
      for (const e of nrowbuf) byteArray.push(e);
      for (const e of ncolbuf) byteArray.push(e);
      // databuf = databuf.slice(2);
      for (const j = 0; j < data.length; j++) {
        const buf;
        if (!(data[j] instanceof Array))
          buf = tUtil.scalar2BufR(data[j], { header: false, dt: dt });
        else buf = new BasicVector(data[j]).tobytes().slice(10);
        for (const e of buf) byteArray.push(e);
      }
    } else {
      return super.tobytes();
    }
    return Buffer.from(byteArray);
  }
}
export default BasicMat;
