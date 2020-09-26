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

export {
  BasicInt,
  BasicByte,
  BasicBool,
  BasicShort,
  BasicLong,
  BasicDate,
  BasicMonth,
  BasicTime,
  BasicMinute,
  BasicSecond,
  BasicDateTime,
  BasicTimeStamp,
  BasicNanoTime,
  BasicFloat,
  BasicDouble,
  BasicVector,
  BasicPair,
  BasicMat,
  BasicSet,
  BasicDict,
  BasicTable,
  BasicNanoTimeStamp,
  BasicScalar,
  BasicUuid,
  BasicIpAddr,
  BasicInt128,
  BasicNull,
  BasicSymbol,
  BasicChar,
};

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
  export function Bool(value) {
    return arrayLize(value, function (v) {
      return new BasicBool(v);
    });
  }

  export function Char(value) {
    return arrayLize(value, function (v) {
      return new BasicChar(v);
    });
  }

  export function Byte(value) {
    return arrayLize(value, function (v) {
      return new BasicByte(v);
    });
  }

  export function Short(value) {
    return arrayLize(value, function (v) {
      return new BasicShort(v);
    });
  }

  export function Int(value) {
    return arrayLize(value, function (v) {
      return new BasicInt(v);
    });
  }

  export function Long(value) {
    return arrayLize(value, function (v) {
      return new BasicLong(v);
    });
  }

  export function Date(value) {
    return arrayLize(value, function (v) {
      return new BasicDate(v);
    });
  }

  export function Month(value) {
    return arrayLize(value, function (v) {
      return new BasicMonth(v);
    });
  }

  export function Time(value) {
    return arrayLize(value, function (v) {
      return new BasicTime(v);
    });
  }

  export function Minute(value) {
    return arrayLize(value, function (v) {
      return new BasicMinute(v);
    });
  }

  export function Second(value) {
    return arrayLize(value, function (v) {
      return new BasicSecond(v);
    });
  }

  export function DateTime(value) {
    return arrayLize(value, function (v) {
      return new BasicDateTime(v);
    });
  }

  export function TimeStamp(value) {
    return arrayLize(value, function (v) {
      return new BasicTimeStamp(v);
    });
  }

  export function NanoTime(value) {
    return arrayLize(value, function (v) {
      return new BasicNanoTime(v);
    });
  }

  export function NanoTimeStamp(value) {
    return arrayLize(value, function (v) {
      return new BasicNanoTimeStamp(v);
    });
  }

  export function Float(value) {
    return arrayLize(value, function (v) {
      return new BasicFloat(v);
    });
  }

  export function Double(value) {
    return arrayLize(value, function (v) {
      return new BasicDouble(v);
    });
  }

  export function Vector(value) {
    return new BasicVector(value);
  }

  export function Pair(value) {
    return arrayLize(value, function (v) {
      return new BasicPair(v);
    });
  }

  export function Matrix(value) {
    return arrayLize(value, function (v) {
      return new BasicMat(v);
    });
  }

  export function Set(value) {
    return arrayLize(value, function (v) {
      return new BasicSet(v);
    });
  }

  export function Dict(value) {
    return arrayLize(value, function (v) {
      return new BasicDict(v);
    });
  }

  export function Table(value) {
    return arrayLize(value, function (v) {
      return new BasicTable(v);
    });
  }

  export function UUID(value) {
    return arrayLize(value, function (v) {
      return new BasicUuid(v);
    });
  }

  export function IpAddr(value) {
    return arrayLize(value, function (v) {
      return new BasicIpAddr(v);
    });
  }

  export function Int128(value) {
    return arrayLize(value, function (v) {
      return new BasicInt128(v);
    });
  }

  export function Null(value) {
    // value is data type
    return arrayLize(value, function (v) {
      return new BasicNull(v);
    });
  }

  export function Symbol(value) {
    return arrayLize(value, function (v) {
      return new BasicSymbol(v);
    });
  }
}
export default DtCt;
