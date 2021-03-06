const jwt = require("jsonwebtoken");
const User = require("../models/user");

//verify token
async function authToken(req, res, next) {
  let token = req.cookies["x-auth"];
  console.log(token);
  if (token || token === undefined) {
    console.log("token inside",req.headers.usertoken);
    token = req.headers.usertoken;
  }
  try {
    console.log(token)
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.SECRECT_KEY);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    res.locals.currentUser = user;
    next();
  } catch (error) {
    res.locals.currentUser = null;
    console.log("Not authorized to access this resource");
    res.send(error);
    // res.redirect("/user/login");
  }
}
// See current user in templates
const checkUser = async (req, res, next) => {
  const token = req.cookies["x-auth"];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRECT_KEY);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) throw new Error();
      res.locals.currentUser = user;
      next();
    } else throw new Error();
  } catch (error) {
    console.log(error.message);
    res.locals.currentUser = null;
    next();
  }
};

module.exports = { authToken, checkUser };
