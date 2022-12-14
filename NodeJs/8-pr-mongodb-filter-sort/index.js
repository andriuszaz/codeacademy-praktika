const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const URI = process.env.URI;
const client = new MongoClient(URI);
const PORT = +process.env.PORT || 5001;
const DB = process.env.DB;
const DBCOLLECTION = process.env.DBCOLLECTION;

app.get("/pets", async (_, res) => {
  try {
    const con = await client.connect();
    const pets = await con.db(DB).collection(DBCOLLECTION).find().toArray();

    await con.close();

    return res.send(pets).end();
  } catch (err) {
    res.status(500).send(err).end();
  }
});

app.get("/pets/:types?/:order?", async (req, res) => {
  try {
    const con = await client.connect();
    const pets = await con
      .db(DB)
      .collection(DBCOLLECTION)
      .find({ type: { $in: req.params.types?.split(",") } })
      .sort({ age: req.params.order?.toLowerCase() === "dsc" ? -1 : 1 })
      .toArray();

    await con.close();

    return res.send(pets).end();
  } catch (err) {
    res.status(500).send(err).end();
  }
});

app.get("/pets/age/byoldest", async (req, res) => {
  try {
    const con = await client.connect();
    const pets = await con
      .db(DB)
      .collection(DBCOLLECTION)
      .find()
      .sort({ age: -1 })
      .toArray();

    await con.close();

    return res.send(pets).end();
  } catch (err) {
    res.status(500).send(err).end();
  }
});

app.get("/pets/age/byyoungest", async (req, res) => {
  try {
    const con = await client.connect();
    const pets = await con
      .db(DB)
      .collection(DBCOLLECTION)
      .find()
      .sort({ age: 1 })
      .toArray();

    await con.close();

    return res.send(pets).end();
  } catch (err) {
    res.status(500).send(err).end();
  }
});

app.post("/pet", async (req, res) => {
  const { firstName, type } = req.body;
  const age = +req.body.age;

  if (!firstName || !type || !age) {
    res.status(400).send("You did not provided pets name, type or age");
    return;
  }

  if (typeof firstName !== "string" || typeof type !== "string") {
    res.status(400).send("Pets name and type provided incorrectly");
    return;
  }

  if (typeof age !== "number") {
    res.status(400).send("Pets age provided incorrectly, please input number");
    return;
  }

  try {
    const con = await client.connect();
    const pet = await con
      .db(DB)
      .collection(DBCOLLECTION)
      .insertOne({ firstName, type, age });

    await con.close();

    return res.send(pet).end();
  } catch (err) {
    res.status(500).send({ err }).end();
  }
});

app.listen(PORT, () => console.log(`port: ${PORT}`));
