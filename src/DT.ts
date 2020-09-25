import BasicInt from "./BasicInt";
import BasicByte from "./BasicByte";
import BasicBool from "./BasicBool";
import BasicShort from "./BasicShort";
import BasicLong from "./BasicLong";
import BasicDate from "./BasicDate";
import BasicMonth from "./BasicMonth";
import BasicTime from "./BasicTime";
import BasicMinute from "./BasicMinute";
import BasicSecond from "./BasicSecond";
import BasicDateTime from "./BasicDateTime";
import BasicTimeStamp from "./BasicTimeStamp";
import BasicNanoTime from "./BasicNanoTime";
import BasicFloat from "./BasicFloat";
import BasicDouble from "./BasicDouble";
import BasicVector from "./BasicVector";
import BasicPair from "./BasicPair";
import BasicMat from "./BasicMat";
import BasicSet from "./BasicSet";
import BasicDict from "./BasicDict";
import BasicTable from "./BasicTable";
import BasicNanoTimeStamp from "./BasicNanoTimeStamp";
import BasicScalar from "./BasicScalar";
import BasicUuid from "./BasicUuid";
import BasicIpAddr from "./BasicIpAddr";
import BasicInt128 from "./BasicInt128";
import BasicNull from "./BasicNull";
import BasicSymbol from "./BasicSymbol";
import BasicChar from "./BasicChar";

function arrayLize(value, ftypect) {
  if (value instanceof BasicScalar) return value;
  if (!(value instanceof Array)) return ftypect(value);
  let v = value;
  for (let i = 0; i < v.length; i++) {
    v[i] = arrayLize(v[i], ftypect);
  }
  return v;
}

namespace DtCt {
  function Bool(value) {
    return arrayLize(value, function (v) {
      return new BasicBool(v);
    });
  }

  function Char(value) {
    return arrayLize(value, function (v) {
      return new BasicChar(v);
    });
  }

  function Byte(value) {
    return arrayLize(value, function (v) {
      return new BasicByte(v);
    });
  }

  function Short(value) {
    return arrayLize(value, function (v) {
      return new BasicShort(v);
    });
  }

  function Int(value) {
    return arrayLize(value, function (v) {
      return new BasicInt(v);
    });
  }

  function Long(value) {
    return arrayLize(value, function (v) {
      return new BasicLong(v);
    });
  }

  function Date(value) {
    return arrayLize(value, function (v) {
      return new BasicDate(v);
    });
  }

  function Month(value) {
    return arrayLize(value, function (v) {
      return new BasicMonth(v);
    });
  }

  function Time(value) {
    return arrayLize(value, function (v) {
      return new BasicTime(v);
    });
  }

  function Minute(value) {
    return arrayLize(value, function (v) {
      return new BasicMinute(v);
    });
  }

  function Second(value) {
    return arrayLize(value, function (v) {
      return new BasicSecond(v);
    });
  }

  function DateTime(value) {
    return arrayLize(value, function (v) {
      return new BasicDateTime(v);
    });
  }

  function TimeStamp(value) {
    return arrayLize(value, function (v) {
      return new BasicTimeStamp(v);
    });
  }

  function NanoTime(value) {
    return arrayLize(value, function (v) {
      return new BasicNanoTime(v);
    });
  }

  function NanoTimeStamp(value) {
    return arrayLize(value, function (v) {
      return new BasicNanoTimeStamp(v);
    });
  }

  function Float(value) {
    return arrayLize(value, function (v) {
      return new BasicFloat(v);
    });
  }

  function Double(value) {
    return arrayLize(value, function (v) {
      return new BasicDouble(v);
    });
  }

  function Vector(value) {
    return new BasicVector(value);
  }

  function Pair(value) {
    return arrayLize(value, function (v) {
      return new BasicPair(v);
    });
  }

  function Matrix(value) {
    return arrayLize(value, function (v) {
      return new BasicMat(v);
    });
  }

  function Set(value) {
    return arrayLize(value, function (v) {
      return new BasicSet(v);
    });
  }

  function Dict(value) {
    return arrayLize(value, function (v) {
      return new BasicDict(v);
    });
  }

  function Table(value) {
    return arrayLize(value, function (v) {
      return new BasicTable(v);
    });
  }

  function UUID(value) {
    return arrayLize(value, function (v) {
      return new BasicUuid(v);
    });
  }

  function IpAddr(value) {
    return arrayLize(value, function (v) {
      return new BasicIpAddr(v);
    });
  }

  function Int128(value) {
    return arrayLize(value, function (v) {
      return new BasicInt128(v);
    });
  }

  function Null(value) {
    // value is data type
    return arrayLize(value, function (v) {
      return new BasicNull(v);
    });
  }

  function Symbol(value) {
    return arrayLize(value, function (v) {
      return new BasicSymbol(v);
    });
  }
}
export default DtCt;
