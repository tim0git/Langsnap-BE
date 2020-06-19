const authRouter = require("express").Router();
const { signinUser, auth } = require("../controller/auth.controller");
const { handle405s } = require("../error/errorHandling");

authRouter.route("/").post(signinUser).all(handle405s);

authRouter.route("/test").get(auth, (req, res) => {
  res.status(200).send({ message: req.email });
});

module.exports = { authRouter };
