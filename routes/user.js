const userRouter = require("express").Router();
const { wordsRouter } = require("./words");
const { createNewUser } = require("../controller/user");

userRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/user" });
});

//signIn user
userRouter.route("/").post(createNewUser);
userRouter.use("/words", wordsRouter);

module.exports = { userRouter };
