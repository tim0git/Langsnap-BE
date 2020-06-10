const firebase = require("firebase");
const admin = require("firebase-admin");
const serviceAccount = require("../config/pointtranslate-da844-firebase-adminsdk-prgku-17a5c09beb.json");

// database call for access to users profile.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pointtranslate-da844.firebaseio.com",
  });
}
const database = admin.database();

//sign user in. FireBase Auth.
exports.signinUser = async (req, res, next) => {
  const { password, email } = req.body;
  if (!password)
    return next({
      status: 400,
      message: "The password must be 6 characters long or more.",
    });
  let regex = /^\S+@\S+$/;
  if (!regex.test(email))
    return next({
      status: 400,
      message: "The email address is badly formatted.",
    });
  try {
    const userInfo = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const uid = userInfo.user.uid;
    const customToken = await admin.auth().createCustomToken(uid);
    ref = database.ref("users/" + uid);
    ref.once("value", (snapShot) => {
      const user = snapShot.val();
      res.status(200).send({ token: customToken, user: user });
    });
  } catch ({ code, message }) {
    next({ code: code, message: message });
  }
}; //done no further work required

// Tested and working auth checker,
exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "no token, authorisation denied" });
  }
  try {
    const authorised = await firebase.auth().signInWithCustomToken(token);
    req.uid = authorised.user.uid;
    req.email = authorised.user.email;
    next();
  } catch (err) {
    res.status(401).send({ message: "token is not valid" });
  }
}; // done,
