import BasicScalar from "./BasicScalar";

class TimeObj extends BasicScalar {
  value = null;
  timeObj = null;

  get() {
    return null;
  }

  toString() {
    return this.timeObj.toString();
  }

  clear() {
    this.timeObj = null;
  }
}

export default TimeObj;
