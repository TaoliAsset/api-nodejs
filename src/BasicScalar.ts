class BasicScalar {
  value = null;
  dform = 0;
  isSmall = true;
  dtype: number;
  dfrom: number;
  constructor() {}
  tobytes() {
    return null;
  }
  small(isSmall = true) {
    this.isSmall = isSmall;
    return this;
  }
  hdrbytes() {
    return Buffer.from([this.dtype, this.dfrom]);
  }
}
export default BasicScalar;
