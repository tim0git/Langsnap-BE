const userRouter = require("express").Router();
const { wordsRouter } = require("./words.router");
const { createNewUser } = require("../controller/user.controller");
const { handle405s } = require("../error/errorHandling");

userRouter.route("/").post(createNewUser).all(handle405s);
userRouter.use("/words", wordsRouter);

module.exports = { userRouter };
