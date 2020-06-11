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

exports.signIn = async (email, password) => {
  const userInfo = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  const uid = userInfo.user.uid;
  return uid;
};

exports.signInToken = async (token) => {
  const authorised = await firebase.auth().signInWithCustomToken(token);
  return authorised;
};

exports.getUserProfile = async (uid) => {
  ref = database.ref("users/" + uid);
  return ref.once("value", (snapShot) => {
    return snapShot.val();
  });
};

exports.createUserDB = async (newUser, uid) => {
  usersRef.child(uid).set(newUser);
};

exports.saveWordToUserDB = async (uid, newWord) => {
  ref = database.ref("users/" + uid);

  const newPostKey = ref.push().key;

  const updates = {};

  updates["/words/" + newPostKey] = newWord;

  ref.update(updates);

  const wordsList = await ref.child("words").once("value", (snapShot) => {
    const wordsList = snapShot.val();
    return wordsList;
  });

  return wordsList;
};
