import BasicScalar from "./BasicScalar";

class TimeObj extends BasicScalar {
  constructor() {
    super();
    this.value = null;
    this.timeObj = null;
  }

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
