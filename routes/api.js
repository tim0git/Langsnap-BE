const apiRouter = require("express").Router();
const { authRouter } = require("./auth");
const { userRouter } = require("./user");

apiRouter.route("/").get((req, res) => {
  console.log("api route working");
  res.send({ message: "working GET /api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

module.exports = { apiRouter };
