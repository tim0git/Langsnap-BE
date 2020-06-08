const firebase = require("firebase");
const admin = require("firebase-admin");
const serviceAccount = require("../config/pointtranslate-da844-firebase-adminsdk-prgku-17a5c09beb.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pointtranslate-da844.firebaseio.com",
  });
}
const database = admin.database();
const usersRef = database.ref("/users");

// create new user. FireBase Auth.
exports.createNewUser = async (req, res, next) => {
  const { password, email, name } = req.body;
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const uid = result.user.uid;

    const token = await admin.auth().createCustomToken(uid);

    const user = {
      name,
      email,
    };
    usersRef.child(uid).set(user);
    // create user in database..
    // Send back token and user profile from database...
    res.status(201).send({ token: token, user: user });
  } catch ({ code, message }) {
    next({ code: code, message: message });
  }
};
