const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/saleApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
    // res.send(err);
  });
