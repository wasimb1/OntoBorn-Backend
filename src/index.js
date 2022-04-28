const express = require("express"),
  dotenv = require("dotenv").config(),
  bcrypt = require("bcrypt"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  cookieParser = require("cookie-parser"),
  cors = require("cors"),
  jwt = require("jsonwebtoken");

const app = express();

//connect database
require("./dbCon");
const userController = require("../controllers/user"),
  saleController = require("../controllers/sale"),
  { authToken, checkUser } = require("../middleware/auth");

// returns updated document after quering
mongoose.set("returnOriginal", false);

//Bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//cookie parser
app.use(cookieParser());
// set directory for static files
app.use(express.static("public"));
//use method-override
app.use(methodOverride("_method"));
//setuplocal variable
app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  next();
});

//route setup
// app.get("*", checkUser);
app.use("/users", userController);
app.use("/sales", saleController);
app.get("/", (req, res) => res.redirect("/sales"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running at port 3000");
});
