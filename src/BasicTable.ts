import BasicVector from "./BasicVector";
import BasicInt from "./BasicInt";
import Util from "./util";

class BasicTable extends BasicVector {
  tablename;
  colnames;
  types;
  constructor(value) {
    if (value == null) super(null);
    else {
      const { tablename, colnames, types, data } = value;
      super(data);
      this.tablename = tablename;
      this.colnames = colnames;
      this.types = types;
    }
    this.dform = 6;
  }
  tobytes() {
    const byteArray = new Array();
    if (this.dt !== -1) {
      const tbname = this.tablename;
      const colnames = this.colnames;
      const buf;
      if (tbname == null) tbname = "";
      if (colnames == null || colnames.length === 0) {
        const ncol = this.value.length;
        colnames = new Array(ncol);
        for (const i = 0; i < ncol; i++) colnames[i] = "col" + i;
      }
      byteArray.push(0, this.dform);
      const ncol = this.value.length;
      const nrow = this.value[0].length;
      const nrowbuf = new BasicInt(nrow).tobytes();
      const ncolbuf = new BasicInt(ncol).tobytes();
      for (const e of nrowbuf) byteArray.push(e);
      for (const e of ncolbuf) byteArray.push(e);
      buf = Util.str2Buf(tbname);
      for (const e of buf) byteArray.push(e);
      for (const name of colnames) {
        buf = Util.str2Buf(name);
        for (const e of buf) byteArray.push(e);
      }
      // buf = super.tobytes();
      const data = this.value;
      const types = this.types;
      for (const i = 0; i < data.length; i++) {
        const v = new BasicVector(data[i]);
        if (types != null && types.length !== 0)
          v.dt = Util.dtypeByName(types[i]);
        buf = v.tobytes();
        for (const e of buf) byteArray.push(e);
      }
    } else {
      return super.tobytes();
    }
    return Buffer.from(byteArray);
  }
}
export default BasicTable;
