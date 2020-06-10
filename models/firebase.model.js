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

exports.createUser = async (email, password) => {
  const result = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  return result;
};

exports.generateToken = async (uid) => {
  const token = await admin.auth().createCustomToken(uid);
  return token;
};
