const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

//Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ueibnfi.mongodb.net/?retryWrites=true&w=majority`;

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
    console.log(error);
  }
});

app.get("/allservices", async (req, res) => {
  try {
    const query = {};
    const cursor = serviceCollection.find(query);
    const allServices = await cursor.toArray();
    res.send(allServices);
    // console.log(allServices);
  } catch {
    console.log(error);
  }
});

app.post("/addServices", async (req, res) => {
  try {
    const service = req.body;
    const result = await serviceCollection.insertOne(service);
    // console.log(result);
    if (result.acknowledged) {
      res.send({
        success: true,
        message: `${service.service_name} Successfully added`,
        data: result,
      });
    } else {
      res.send({
        success: false,
        error: "Service not added",
      });
    }
  } catch (error) {
    console.log("line:74", error);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);
    res.send({
      data: service,
    });
  } catch {}
});

//Test
app.get("/test", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("server is running on", port);
});
