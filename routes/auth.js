const authRouter = require("express").Router();
const { signinUser, auth } = require("../controller/auth");

authRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/auth" });
});

//signIn user
authRouter.route("/").post(signinUser);

//test if auth works on private routes
authRouter.route("/test").get(auth, (req, res) => {
  res.status(200).send({ message: req.email });
});

module.exports = { authRouter };
