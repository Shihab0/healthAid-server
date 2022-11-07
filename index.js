const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Test
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("server is running on", port);
});