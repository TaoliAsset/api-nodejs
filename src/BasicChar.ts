import BasicByte from "./BasicByte";

class BasicChar extends BasicByte {
  constructor(value: string) {
    value.length > 0 ? super(value.charCodeAt(0)) : super(null);
  }
}
export default BasicChar;
