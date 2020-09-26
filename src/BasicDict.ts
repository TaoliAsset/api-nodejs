import BasicVector from "./BasicVector";

class BasicDict extends BasicVector {
  keys: string[];
  constructor(value) {
    if (!(value instanceof Map)) super(null);
    else {
      super(Array.from(value.values()));
      this.keys = Array.from(value.keys());
    }
    this.dform = 5;
  }
  tobytes() {
    const dt = this.dt;
    const byteArray = new Array();
    if (dt !== -1) {
      byteArray.push(dt, this.dform);
      const keybuf = new BasicVector(this.keys).tobytes();
      const valuebuf = super.tobytes();
      for (const e of keybuf) byteArray.push(e);
      for (const e of valuebuf) byteArray.push(e);
    } else {
      return super.tobytes();
    }
    return Buffer.from(byteArray);
  }
}
export default BasicDict;
