const associationsRouter = require("express").Router();
const {
  associationsWord,
  associationsWordGame,
} = require("../controller/translate.controller");

const { handle405s } = require("../error/errorHandling");

//get word associations
associationsRouter.route("/").post(associationsWord).all(handle405s);
associationsRouter.route("/game").post(associationsWordGame).all(handle405s);

module.exports = { associationsRouter };
