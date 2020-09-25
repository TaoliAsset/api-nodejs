# NodeJS-API

## 使用说明

### 1. 建立连接

```js
let DBconnection = require("./src/DBconnection");
let conn = new DBconnection();
await conn.connect("localhost", 8848);
```

函数说明：

connect(host, port, username, password)

- host: 主机名
- port: 主机端口
- username: 用户名
- password: 用户密码

### 2. 运行脚本

建立连接之后，可以把脚本传输到服务端运行，并返回相应结果，如下所示：

```js
let result;
result = await conn.run("typestr [1,2,3]");
// 返回 FAST INT VECTOR
result = await conn.run("dict(1 7 5,`AA`BB`CC)");
// 返回 Map(3) {5 => CC, 1 => AA, 7=> BB}
```

### 3. 运行函数

```js
result = await conn.runFunc("add", [1, 2, 3], [4, 5, 6]);
// 返回 [5,7,9]
await conn.run("a=[1,2,3]");
result = await conn.runFunc("add{a,}", [1, 2.6, 7]);
// 返回 [2, 4.6, 10]
```

函数说明：

runFunc(funcName, ...args)

- funcName: 要在服务端运行的函数名（由数据库本身提供）
- args: 参数列表，可传入任意多个参数

注意,在上传参数时，可能需要进行包装, 以下进行说明：

标量类型

---

- bool 类型， 可以直接传递或使用 DT.Bool 包装
- char 类型， 需使用 DT.Char 包装
- short 类型， 需使用 DT.Short 包装
- int 类型， 可以直接传递或使用 DT.Int 包装
- long 类型， 可以直接传递或使用 DT.Long 包装
- date 类型，需使用 DT.Date 包装，支持字符串格式`YYYY-MM-DD`，对象格式`{year: 1970, month: 1, day: 1}`和天数格式（距离 1970 年 1 月 1 日的天数）
- month 类型，需要使用 DT.Month 包装，支持字符串格式`YYYY-MM`，对象格式`{year: 1970, month: 1}`和月格式（距离公元 0 年初始的月数）
- time 类型， 需使用 DT.Time 包装，支持字符串格式`HH:mm:ss.s`，对象格式`{hour: 0, minute: 0, second: 0, nanoSecond: 0}`和毫秒格式（距离当天 0 点的毫秒数）
- minute 类型： 需使用 DT.Minute 包装，支持字符串格式`HH:mm`，对象格式`{hour: 0, minute: 0}`和分钟格式（距离当天 0 点的分钟数）
- second 类型： 需要使用 DT.Second 包装，支持字符串格式`HH:mm:ss`，对象格式`{hour: 0, minute: 0, second:0}`和秒格式（距离当天 0 点的秒数）
- datetime 类型：需要使用 DT.DateTime 包装，支持字符串格式`YYYY-MM-DD HH:mm:ss`，对象格式`{year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0}`和秒格式(距离 1970 年 1 月 1 日 0 点的秒数)
- timestamp 类型: 需要使用 DT.TimeStamp 包装，支持字符串格式`YYYY-MM-DD HH:mm:ss.s`, 对象格式`{date: {year: 1970, month: 1, day: 1}, time: {hour: 0, minute: 0, second: 0, nanoSecond: 0}}`和毫秒格式（距离 1970 年 1 月 1 日 0 点的毫秒数，需要使用 BigInt 类型数值）
- nanotime 类型：需要使用 DT.NanoTimeStamp 包装，支持字符串格式`YYYY-MM-DD HH:mm:ss.s`,对象格式`{hour: 0, minute: 0, second: 0, nanoSecond: 0}`和纳秒格式（距离当天 0 点的纳秒数，需使用 BigInt 类型数值）
- nanotimestamp 类型： 需要使用 DT.NanoTimeStamp 包装，支持字符串格式`YYYY-MM-DD HH:mm:ss.s`，对象格式`{date: {year: 1970, month: 1, day: 1}, time: {hour: 0, minute: 0, second: 0, nanoSecond: 0}}`和纳秒格式（距离 1970 年 1 月 1 日 0 点的纳秒数，需要使用 BigInt 类型数值）
- float 类型: 需要使用 DT.Float 包装
- double 类型: 可以直接传递或使用 DT.Double 包装
- symbol 类型: 需要使用 DT.Symbol 包装
- string 类型： 可以直接传递或使用 DT.String 包装
- uuid 类型: 需要使用 DT.UUID 包装，支持字符串格式`00000000-0000-0000-0000-000000000000`和对象格式`{high: 0n, low: 0n}`
- ipaddr 类型： 需要使用 DT.IpAddr 包装，支持字符串格式`192.168.1.0`和对象格式`{high: 0n, low: 0n}`。对于 Ipv6 格式，可以直接以 16 进制字符格式传递（不要`:`号）
- int128 类型：需要使用 DT.Int128 包装，支持字符串格式`e1671797c52e15f763380b45e841ec32`和对象格式`{high: 0n, low: 0n}`
- null 类型： 需要使用 DT.Null 包装。以上各种类型都对应一个 NULL 类型，例如 int 类型的 NULL 类型可表示为`DT.Int(), DT.Int(null), DT.Null('int')`, 对于服务器端`void`类型，则使用`DT.Null(0)`或`DT.Null('void')`表示。

复合类型

---

- vector 类型： 对应 javascript 中的 Array 类型，可以直接传递或使用 DT.Vector 包装
- pair 类型： 2 元组的 vector 类型，需使用 DT.Pair 包装，传入字符形式的数据对，如`'12:18'`
- matrix 类型： 需要使用 DT.Matrix 包装，传入矩阵对象`{colnames:[], rownames: [], type: 'int', data: [[1,2],[3,4]]}`。除了`data`为必须，其它均可不设置
- set 类型： 对应 javascript 中的 Set 类型，需要使用 DT.Set 包装
- dictionary 类型： 对应 javascript 中的 Map 类型，需要使用 DT.Dict 包装
- table 类型： 需要使用 DT.Table 包装， 传入表对象`{tablename:'t', colnames: ['id','val'], types: ['int','string'], data: [[1,2,3],['aa','bb','mm']]}`。除了`data`为必须，其它均可不设置

### 4. 上传本地对象到服务器

```js
await conn.upload("a", DT.TimeStamp("2012-06-13 13:30:10.008"));
result = await conn.run("a");
// 返回TimeStamp对象， 需使用toString()方法格式化输出， 结果为： 2012-6-13 13:30:10.8000000ns
```

函数说明：

upload(varnames, ...vars)

- varnames: 上传的变量名，如有多个，以`,`分隔。
- vars: 变量列表，可传入任意多个变量

上传变量格式与上传函数参数时使用的格式相同
