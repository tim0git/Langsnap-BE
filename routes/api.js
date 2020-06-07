const apiRouter = require("express").Router();
const { authRouter } = require("./auth");
const { userRouter } = require("./user");
const { translateRouter } = require("./translate");
const { associationsRouter } = require("./associations");

apiRouter.route("/").get((req, res) => {
  console.log("api route working");
  res.send({ message: "working GET /api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/translate", translateRouter);
apiRouter.use("/associations", associationsRouter);

module.exports = { apiRouter };
