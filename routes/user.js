const userRouter = require("express").Router();
const firebase = require("firebase");
const { createNewUser } = require("../controller/user");

userRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/user" });
});

//signIn user
userRouter.route("/").post(createNewUser);

module.exports = { userRouter };
