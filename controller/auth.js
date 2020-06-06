const firebase = require("firebase");

exports.signinUser = (req, res, next) => {
  const { password, email } = req.body;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch(function ({ code, message }) {
      next({ code: code, message: message });
    });
};
