const authRouter = require("express").Router();
const { signinUser, auth } = require("../controller/auth.controller");
const { handle405s } = require("../error/errorHandling");

//signIn user
authRouter.route("/").post(signinUser).all(handle405s);

//test if auth works on private routes
authRouter.route("/test").get(auth, (req, res) => {
  res.status(200).send({ message: req.email });
});

module.exports = { authRouter };
