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

let DtCt = new Object();

function arrayLize(value, ftypect) {
  if (value instanceof BasicScalar) return value;
  if (!(value instanceof Array)) return ftypect(value);
  let v = value;
  for (let i = 0; i < v.length; i++) {
    v[i] = arrayLize(v[i], ftypect);
  }
  return v;
}

DtCt.Bool = function (value) {
  return arrayLize(value, function (v) {
    return new BasicBool(v);
  });
};

DtCt.Char = function (value) {
  return arrayLize(value, function (v) {
    return new BasicChar(v);
  });
};

DtCt.Byte = function (value) {
  return arrayLize(value, function (v) {
    return new BasicByte(v);
  });
};

DtCt.Short = function (value) {
  return arrayLize(value, function (v) {
    return new BasicShort(v);
  });
};

DtCt.Int = function (value) {
  return arrayLize(value, function (v) {
    return new BasicInt(v);
  });
};

DtCt.Long = function (value) {
  return arrayLize(value, function (v) {
    return new BasicLong(v);
  });
};

DtCt.Date = function (value) {
  return arrayLize(value, function (v) {
    return new BasicDate(v);
  });
};

DtCt.Month = function (value) {
  return arrayLize(value, function (v) {
    return new BasicMonth(v);
  });
};

DtCt.Time = function (value) {
  return arrayLize(value, function (v) {
    return new BasicTime(v);
  });
};

DtCt.Minute = function (value) {
  return arrayLize(value, function (v) {
    return new BasicMinute(v);
  });
};

DtCt.Second = function (value) {
  return arrayLize(value, function (v) {
    return new BasicSecond(v);
  });
};

DtCt.DateTime = function (value) {
  return arrayLize(value, function (v) {
    return new BasicDateTime(v);
  });
};

DtCt.TimeStamp = function (value) {
  return arrayLize(value, function (v) {
    return new BasicTimeStamp(v);
  });
};

DtCt.NanoTime = function (value) {
  return arrayLize(value, function (v) {
    return new BasicNanoTime(v);
  });
};

DtCt.NanoTimeStamp = function (value) {
  return arrayLize(value, function (v) {
    return new BasicNanoTimeStamp(v);
  });
};

DtCt.Float = function (value) {
  return arrayLize(value, function (v) {
    return new BasicFloat(v);
  });
};

DtCt.Double = function (value) {
  return arrayLize(value, function (v) {
    return new BasicDouble(v);
  });
};

DtCt.Vector = function (value) {
  return new BasicVector(value);
};

DtCt.Pair = function (value) {
  return arrayLize(value, function (v) {
    return new BasicPair(v);
  });
};

DtCt.Matrix = function (value) {
  return arrayLize(value, function (v) {
    return new BasicMat(v);
  });
};

DtCt.Set = function (value) {
  return arrayLize(value, function (v) {
    return new BasicSet(v);
  });
};

DtCt.Dict = function (value) {
  return arrayLize(value, function (v) {
    return new BasicDict(v);
  });
};

DtCt.Table = function (value) {
  return arrayLize(value, function (v) {
    return new BasicTable(v);
  });
};

DtCt.UUID = function (value) {
  return arrayLize(value, function (v) {
    return new BasicUuid(v);
  });
};

DtCt.IpAddr = function (value) {
  return arrayLize(value, function (v) {
    return new BasicIpAddr(v);
  });
};

DtCt.Int128 = function (value) {
  return arrayLize(value, function (v) {
    return new BasicInt128(v);
  });
};

DtCt.Null = function (value) {
  // value is data type
  return arrayLize(value, function (v) {
    return new BasicNull(v);
  });
};

DtCt.Symbol = function (value) {
  return arrayLize(value, function (v) {
    return new BasicSymbol(v);
  });
};

export default DtCt;
