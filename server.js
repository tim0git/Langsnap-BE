const express = require("express");
const {
  handleCustomError,
  handleInternalError,
  handleFirebase_Error,
  handleTranslateError,
} = require("./error/errorHandling");
const { apiRouter } = require("./routes/api");

const cors = require("cors"); //  'This is CORS-enabled for all origins!'

//Firebase Auth Connection, required in all firebase optins for test purposes only.
const { firebaseConfig } = require("./config/configFirebase");
const firebase = require("firebase");

if (!firebase.apps.length) {
  const appFirebase = firebase.initializeApp(firebaseConfig);
}

const admin = require("firebase-admin");

//admin account to enable token creation
const serviceAccount = require("./config/pointtranslate-da844-firebase-adminsdk-prgku-17a5c09beb.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pointtranslate-da844.firebaseio.com",
  });
}

//initialise express app
const app = express();

//initialise cors for deployment
app.use(cors());
app.use(express.json({ extended: false }));

// working api route 06/06/2020
app.use("/api", apiRouter);

//error handelling.
app.use(handleFirebase_Error);
app.use(handleTranslateError);
app.use(handleCustomError);
app.use(handleInternalError);

//depolyment port and test dev port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

module.exports = { app, server };
