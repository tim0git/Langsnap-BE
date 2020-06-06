const express = require("express");
const { apiRouter } = require("./routes/api");
const cors = require("cors"); //  'This is CORS-enabled for all origins!'
//const connectDB = require("./config/dbconfig");

const { firebaseConfig } = require("./config/configDB");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const app = express();

app.use(cors());
app.use(express.json({ extended: false }));

// working
app.use("/api", apiRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

module.exports = app;
