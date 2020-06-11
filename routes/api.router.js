const apiRouter = require("express").Router();
const { authRouter } = require("./auth.router");
const { userRouter } = require("./user.router");
const { translateRouter } = require("./translate.router");
const { associationsRouter } = require("./associations.router");
const { serveEndpoints } = require("../controller/api.controller");

apiRouter.use("/auth", authRouter); //done
apiRouter.use("/user", userRouter);
apiRouter.use("/translate", translateRouter); //done
apiRouter.use("/associations", associationsRouter); //done
apiRouter.route("/").all(serveEndpoints);
module.exports = { apiRouter };
