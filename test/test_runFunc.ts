async function test_runFunc() {
  const assert = require("assert");
  const DBconnection = require("../src/DBconnection"); //import API module
  const DT = require("../src/DT");
  const myConnect = new DBconnection();

  describe("#DBconnection.js", function () {
    describe("#runFunc()", function () {
      before(async function () {
        const config = require("./setup/settings");
        await myConnect.connect(config.HOST, config.PORT);
      });

      after(function () {
        return;
      });

      it("runFunc all args on ddb", async function () {
        await myConnect.run("x=[1,2,3];y=[4,5,6]");
        const re = await myConnect.run("add(x,y)");
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc first args on server", async function () {
        await myConnect.run("x=[1,2,3]");
        const re = await myConnect.runFunc("add{x}", DT.Int([4, 5, 6]));
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc second args on server", async function () {
        await myConnect.run("y=[1,2,3]");
        const re = await myConnect.runFunc("add{,y}", DT.Int([4, 5, 6]));
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc all args on client", async function () {
        const re = await myConnect.runFunc(
          "add",
          DT.Int([1, 2, 3]),
          DT.Int([4, 5, 6])
        );
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc all args on client", async function () {
        const re = await myConnect.runFunc(
          "add",
          DT.Int([1, 2, 3]),
          DT.Int([4, 5, 6])
        );
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc user defined function", async function () {
        await myConnect.run("def f1(x,y){return x+y}");
        const re = await myConnect.runFunc(
          "f1",
          DT.Int([1, 2, 3]),
          DT.Int([4, 5, 6])
        );
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc user defined function partial application", async function () {
        await myConnect.run("def f1(x,y){return x+y}");
        await myConnect.run("x=[1,2,3]");
        const re = await myConnect.runFunc("f1{x}", DT.Int([4, 5, 6]));
        const expected = new Array(5, 7, 9);
        assert.deepEqual(re, expected);
      });

      it("runFunc no args", async function () {
        const re = await myConnect.runFunc("getNodeAlias");
        const expected = await myConnect.run("getNodeAlias()");
        assert.equal(re, expected);
      });
    });
  });
}

test_runFunc();
