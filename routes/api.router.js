const apiRouter = require("express").Router();
const { authRouter } = require("./auth.router");
const { userRouter } = require("./user.router");
const { translateRouter } = require("./translate.router");
const { associationsRouter } = require("./associations.router");

apiRouter.route("/").get((req, res) => {
  console.log("api route working");
  res.send({ message: "working GET /api" });
});

apiRouter.use("/auth", authRouter); //done
apiRouter.use("/user", userRouter);
apiRouter.use("/translate", translateRouter); //done
apiRouter.use("/associations", associationsRouter); //done

module.exports = { apiRouter };
