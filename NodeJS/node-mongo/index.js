const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017/";
const dbname = "conFusion";

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log("Connected correctly to server");

  const db = client.db(dbname);
  //Creates the collection.
  const collection = db.collection("dishes");
  //Insert JSON data to the collection
  collection.insertOne(
    { name: "Uthappizza", description: "test" },
    (err, result) => {
      assert.equal(err, null);

      console.log("After Insert:\n");
      console.log(result.ops);

      collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);

        console.log("Found:\n");
        console.log(docs);

        //removes the collection previously created
        db.dropCollection("dishes", (err, result) => {
          assert.equal(err, null);

          client.close();
        });
      });
    }
  );
});
