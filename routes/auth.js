const authRouter = require("express").Router();
const { signinUser } = require("../controller/auth");

authRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/auth" });
});

//signIn user
authRouter.route("/").post(signinUser);

module.exports = { authRouter };
