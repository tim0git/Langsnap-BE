const firebase = require("firebase");
const admin = require("firebase-admin");

//admin account to enable token creation
const serviceAccount = require("../config/pointtranslate-da844-firebase-adminsdk-prgku-17a5c09beb.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pointtranslate-da844.firebaseio.com",
  });
}

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
          res.status(200).send({ token: customToken });
        });
    })
    .catch(({ code, message }) => {
      next({ code: code, message: message });
    });
}; //done no further work required

// not yet linked to a route. will be auth checker for private routes...
exports.auth = async (req, res, next) => {
  const token = req.header("token");
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
}; // done must decided if we are checking with uid or email on next() routes. ***
