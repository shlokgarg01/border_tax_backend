const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/place_order");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());

const start = () => {
  app.listen(PORT, () => console.log(`Connected to PORT ${PORT}`));
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to database.."))
    .catch((err) => console.log(err));
};

app.get("/ping", (req, res) => {
  res.status(200).json({
    message: "Success",
  });
});

app.use("/api/v1", router)

start();
