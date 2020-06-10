const userRouter = require("express").Router();
const { wordsRouter } = require("./words.router");
const { createNewUser } = require("../controller/user.controller");

userRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/user" });
});

//signIn user
userRouter.route("/").post(createNewUser);
userRouter.use("/words", wordsRouter);

module.exports = { userRouter };
