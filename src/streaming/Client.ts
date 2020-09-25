const infolevel = require("../constants").infoLevel;

const DBconnection = require("../DBconnection");
const BasicNull = require("../BasicNull");
const BasicLong = require("../BasicLong");
const BasicInt = require("../BasicInt");
const BasicBool = require("../BasicBool");
const Daemon = require("./Daemon");
const events = require("events");

class Client {
  constructor(port, host) {
    this.lport = port;
    this.lhost = host;
    let channel = new events.EventEmitter();
    // channel.subscriptions = {}
    this.channel = channel;
    const daemon = new Daemon(port, channel);
    daemon.run();
  }

  async subscribe(host, port, tableName, actionName, options) {
    let {
      offset = -1,
      handler = null,
      filter = null,
      allowExistTopic = false,
    } = options;
    let conn = new DBconnection();
    if (host === "") host = "127.0.0.1";
    await conn.connect(host, port);
    let res = await conn.runFunc("getSubscriptionTopic", tableName, actionName);
    let topic = res[0];
    if (infolevel >= 1) console.log(topic);

    // this.channel.subscriptions[topic] = handler;

    if (filter === null) filter = new BasicNull(-1);
    offset = new BasicLong(offset);
    let lport = new BasicInt(this.lport);
    let lhost = this.lhost;
    if (lhost == null || lhost === "") lhost = conn.socket.stream.localAddress;
    allowExistTopic = new BasicBool(allowExistTopic);
    res = await conn.runFunc(
      "publishTable",
      lhost,
      lport,
      tableName,
      actionName,
      offset,
      filter,
      allowExistTopic
    );
    // res = await conn.run(`publishTable('${lhost}',${this.lport},'${tableName}','${actionName}',${offset})`);
    if (infolevel >= 1) console.log(res);
    conn.close();

    // listen event
    this.channel.on("join", (id, socket) => {
      if (infolevel >= 1)
        console.log(
          `client${id} ${socket.remoteFamily}, ${socket.remoteAddress}:${socket.remotePort}`
        );
    });

    this.channel.on(topic, (value) => {
      if (handler != null) handler(value);
    });
  }

  async unsubscribe(host, port, tableName, actionName) {
    let conn = new DBconnection();
    await conn.connect(host, port);
    let lport = new BasicInt(this.lport);
    let lhost = this.lhost;
    if (lhost == null || lhost === "") lhost = conn.socket.stream.localAddress;
    // console.log(lhost);
    await conn.runFunc("stopPublishTable", lhost, lport, tableName, actionName);
    // await conn.run(`stopPublishTable('${lhost}', ${this.lport}, '${tableName}', '${actionName}')`)
    conn.close();
    if (infolevel >= 1)
      console.log(`unsubscribe ${host}:${port}:/${tableName}/${actionName}`);
  }
}
module.exports = Client;
