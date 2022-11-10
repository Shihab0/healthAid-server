const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");

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
const reviewCollection = client.db("healthAid").collection("reviews");

//CURD OPERATION
app.get("/services", async (req, res) => {
  try {
    const query = {};
    const cursor = serviceCollection.find(query).limit(3).sort({ _id: -1 });
    const services = await cursor.toArray();
    res.send(services);
  } catch {
    console.log(error);
  }
});

app.get("/allservices", async (req, res) => {
  try {
    const query = {};
    const cursor = serviceCollection.find(query).sort({ _id: -1 });
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

app.post("/addReview", async (req, res) => {
  try {
    const review = req.body;
    const result = await reviewCollection.insertOne(review);
    if (result.acknowledged) {
      res.send({
        success: true,
        message: `${review.name} added review successfully`,
        data: result,
      });
    } else {
      res.send({
        success: false,
        error: "Review Failed",
      });
    }
  } catch {}
});

app.get("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const query = { productId: id };
    const cursor = reviewCollection.find(query).sort({ _id: -1 });
    const review = await cursor.toArray();
    res.send(review);
  } catch {}
});

/////////// Edit & update ////////////////

app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: ObjectId(id) };
    const cursor = serviceCollection.find(query).sort({ _id: -1 });
    const specificService = await cursor.toArray();
    res.send(specificService);
  } catch {}
});

////////edit & update review
app.get("/editReview/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: ObjectId(id) };
    const cursor = reviewCollection.findOne(query);
    const specificReview = await cursor;
    res.send(specificReview);
  } catch {}
});

app.put("/myReview/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const filter = { _id: ObjectId(id) };
  const editedReview = req.body;
  const option = { upsert: true };
  const updatedReview = {
    $set: {
      comment: editedReview.comment,
    },
  };
  const result = await reviewCollection.updateOne(
    filter,
    updatedReview,
    option
  );
  res.send(result);
});

////////////////////////////

app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const editedService = req.body;
  const option = { upsert: true };
  const updatedService = {
    $set: {
      service_name: editedService.service_name,
      service_type: editedService.service_type,
      service_fee: editedService.service_fee,
      image: editedService.image,
      description: editedService.description,
    },
  };
  const result = await serviceCollection.updateOne(
    filter,
    updatedService,
    option
  );
  res.send(result);
});

//////////////////////////////////

/////////////get my review ///////////////
app.get("/review", async (req, res) => {
  let query = {};
  if (req.query.email) {
    query = {
      email: req.query.email,
    };
  }
  const cursor = reviewCollection.find(query).sort({ _id: -1 });
  const result = await cursor.toArray();
  res.send(result);
});

/////////////get details//////////////

app.get("/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);
    res.send({
      data: service,
    });
  } catch {}
});

///////////////////////////////////////////////

///////////// Delete service/////////////////////

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    // console.log(id);
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.deleteOne(query);
    console.log(service);
    res.send({
      data: service,
    });
  } catch {}
});

///////////// Delete review/////////////////////

app.delete("/deleteReview/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    // console.log(id);
    const query = { _id: ObjectId(id) };
    const service = await reviewCollection.deleteOne(query);
    console.log(service);
    res.send({
      data: service,
    });
  } catch {}
});

////////////////////////////////////////////////

//Test
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("server is running on", port);
});
