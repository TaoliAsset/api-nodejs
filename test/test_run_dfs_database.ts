import assert from "assert";

import DBconnection from "../src/DBconnection";
import DT from "../src/DT";
async function test_run_dfs() {
  const myConnect = new DBconnection();

  before(async function () {
    const config = require("./setup/settings");
    await myConnect.connect(config.HOST, config.PORT, "admin", "123456");
  });

  after(function () {
    return;
  });

  beforeEach(async function () {
    const script =
      "" +
      'login("admin", "123456") \n' +
      'dbName="dfs://db_testRun" \n' +
      "if(existsDatabase(dbName)){ \n" +
      "   dropDatabase(dbName) \n" +
      "} \n" +
      "db=database(dbName, VALUE, 1..5) \n" +
      "t=table(take(1..5, 100) as id, 1..100 as val) \n" +
      'pt=db.createPartitionedTable(t, "pt", "id").append!(t) \n';
    await myConnect.run(script);
  });

  describe("#DBconnection.js", function () {
    describe("#run dfs related function()", function () {
      it("run existsDatabase", async function () {
        const re = await myConnect.run('existsDatabase("dfs://db_testRun")');
        assert.equal(re, true);
      });

      it("run existsTable", async function () {
        const re = await myConnect.run('existsTable("dfs://db_testRun", "pt")');
        assert.equal(re, true);
      });

      it("run query dfs table", async function () {
        const re = await myConnect.run(
          'select * from loadTable("dfs://db_testRun", "pt")'
        );
        const colNames = ["id", "val"];
        assert.deepEqual(re.colnames, colNames);
        assert.equal(re.data[0].length, 100);
        assert.equal(re.data[1].length, 100);
      });

      it("run query dfs table", async function () {
        const re = await myConnect.run(
          'select count(*) as num from loadTable("dfs://db_testRun", "pt") group by id'
        );
        const colNames = ["id", "num"];
        const expected1 = [1, 2, 3, 4, 5];
        const expected2 = [20, 20, 20, 20, 20];
        assert.deepEqual(re.colnames, colNames);
        assert.deepEqual(re.data[0], expected1);
        assert.deepEqual(re.data[1], expected2);
      });

      // it('run schema', async function() {
      //     const re = await myConnect.run('schema(loadTable("dfs://db_testRun", "pt"))')
      //     console.log(re)
      // });

      it("run drop partition", async function () {
        await myConnect.run('dropPartition(database("dfs://db_testRun"), 1)');
        const re = await myConnect.run(
          'select * from loadTable("dfs://db_testRun", "pt") where id=1'
        );
        const colNames = ["id", "val"];
        assert.deepEqual(re.colnames, colNames);
        assert.equal(re.data[0].length, 0);
        assert.equal(re.data[1].length, 0);
      });

      it("run drop table", async function () {
        await myConnect.run('dropTable(database("dfs://db_testRun"), "pt")');
        const re = await myConnect.run('existsTable("dfs://db_testRun", "pt")');
        assert.equal(re, false);
      });

      it("run drop database", async function () {
        await myConnect.run('dropDatabase("dfs://db_testRun")');
        const re = await myConnect.run('existsDatabase("dfs://db_testRun")');
        assert.equal(re, false);
      });
    });
  });
}

test_run_dfs();
