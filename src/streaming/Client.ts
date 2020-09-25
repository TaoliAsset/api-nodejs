import constants from "../constants";
const infolevel = constants.infoLevel;
import DBconnection from "../DBconnection";
import BasicNull from "../BasicNull";
import BasicLong from "../BasicLong";
import BasicInt from "../BasicInt";
import BasicBool from "../BasicBool";
import Daemon from "./Daemon";
import { EventEmitter } from "events";

class Client {
  channel = new EventEmitter();
  constructor(public lport: number, public lhost: string) {
    const daemon = new Daemon(lport, this.channel);
    daemon.run();
  }

  async subscribe(
    host: string,
    port: number,
    tableName: string,
    actionName: string,
    options
  ) {
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

  async unsubscribe(host: string, port: number, tableName: string, actionName) {
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
export default Client;
