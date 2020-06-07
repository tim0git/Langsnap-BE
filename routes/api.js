const apiRouter = require("express").Router();
const { authRouter } = require("./auth");
const { userRouter } = require("./user");
const { translateRouter } = require("./translate");
const { associationsRouter } = require("./associations");

apiRouter.route("/").get((req, res) => {
  console.log("api route working");
  res.send({ message: "working GET /api" });
});

apiRouter.use("/auth", authRouter); //done
apiRouter.use("/user", userRouter); 
apiRouter.use("/translate", translateRouter); //done
apiRouter.use("/associations", associationsRouter); //done

module.exports = { apiRouter };
