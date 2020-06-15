const associationsRouter = require("express").Router();
const {
  associationsWord,
  associationsWordGame,
} = require("../controller/translate.controller");
const { auth } = require("../controller/auth.controller");
const { handle405s } = require("../error/errorHandling");

//get word associations
associationsRouter.route("/").post(associationsWord).all(handle405s);
associationsRouter
  .route("/game")
  .post(auth, associationsWordGame)
  .all(handle405s);

module.exports = { associationsRouter };

