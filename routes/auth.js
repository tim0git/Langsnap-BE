const authRouter = require("express").Router();
const firebase = require("firebase");

authRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/auth" });
});

//signIn user
authRouter.route("/").post((req, res) => {
  const { password, email } = req.body;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch(function ({ code, message }) {
      res.status(404).send({ code: code, message: message });
    });
});

module.exports = { authRouter };
