const express = require("express");
const {
  send404,
  handleCustomError,
  handleInternalError,
  handleFirebase_Error,
  handleTranslateError,
} = require("./error/errorHandling");
const { apiRouter } = require("./routes/api.router");

const cors = require("cors");

const { firebaseConfig } = require("./config/configFirebase");
const firebase = require("firebase");

if (!firebase.apps.length) {
  const appFirebase = firebase.initializeApp(firebaseConfig);
}

const app = express();

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/api", apiRouter);
app.use(send404);

app.use(handleFirebase_Error);
app.use(handleTranslateError);
app.use(handleCustomError);
app.use(handleInternalError);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

module.exports = { app, server };
