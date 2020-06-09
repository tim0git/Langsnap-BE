const firebase = require("firebase");
const admin = require("firebase-admin");

//sign user in. FireBase Auth.
exports.signinUser = (req, res, next) => {
  const { password, email } = req.body;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user: { uid } }) => {
      admin
        .auth()
        .createCustomToken(uid)
        .then(function (customToken) {
          //console.log(customToken);
          // either send back the profile or have a onChange event on the front end that listens for a change in the token and then fetches the profile associated with it?
          res.status(200).send({ token: customToken });
        });
    })
    .catch(({ code, message }) => {
      next({ code: code, message: message });
    });
}; //done no further work required

// Tested and working auth checker,
exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "no token, authorisation denied" });
  }
  try {
    const authorised = await firebase.auth().signInWithCustomToken(token);
    req.email = authorised.user.email; //havent decided which one to query database with..
    req.uid = authorised.user.uid;
    next();
  } catch (err) {
    res.status(401).send({ message: "token is not valid" });
  }
}; // done, must decided if we are checking with uid or email on next() routes. ***
