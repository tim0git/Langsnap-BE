const express = require("express");
const {
  handleCustomError,
  handleInternalError,
  handleFirebase_Error,
} = require("./error/errorHandling");
const { apiRouter } = require("./routes/api");

const cors = require("cors"); //  'This is CORS-enabled for all origins!'

//Firebase Auth Connection, required in all firebase optins for test purposes only.
const { firebaseConfig } = require("./config/configDB");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

//initialise express app
const app = express();

//initialise cors for deployment
app.use(cors());
app.use(express.json({ extended: false }));

// working api route 06/06/2020
app.use("/api", apiRouter);

//error handelling.
app.use(handleFirebase_Error);

// app.use(handleCustomError);
// app.use(handleInternalError);

//depolyment port and test dev port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

module.exports = app;
