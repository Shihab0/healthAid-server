const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

//Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ueibnfi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    client.connect();
    console.log("Mongodb Connected");
  } finally {
  }
}
dbConnect().catch((err) => console.log(err));

const serviceCollection = client.db("healthAid").collection("services");

//CURD OPERATION
app.get("/services", async (req, res) => {
  try {
    const query = {};
    const cursor = serviceCollection.find(query).limit(3);
    const services = await cursor.toArray();
    res.send(services);
  } catch {
    console.error();
  }
});

//Test
app.get("/test", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("server is running on", port);
});
