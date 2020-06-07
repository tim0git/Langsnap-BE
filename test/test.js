const firebase = require("firebase");
const admin = require("firebase-admin");
const { app, server } = require("../server");
const request = require("supertest");
const { testUsers } = require("../config/passwords");

//Chai config,
const expect = require("chai").expect;

//test express router for /api
describe("GET /api", () => {
  after(function (done) {
    server.close();
    done();
  });

  it("responds with message", function (done) {
    request(app)
      .get("/api")
      .then((res) => {
        expect(res.body).to.contain.property("message");
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("working GET /api");
        done();
      })
      .catch((err) => done(err));
  });
});

// tests logging into a users account. FireBase Auth.
describe("POST /api/auth", () => {
  after(function (done) {
    server.close();
    done();
  });

  it("responds with a token if correct email and password are provided", function (done) {
    request(app)
      .post("/api/auth")
      .send({
        password: "1234567",
        email: "testperm@icloud.com",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.token).to.a("string");
        expect(res.body).to.contain.property("token");
        done();
      })
      .catch((err) => done(err));
  });
  //error checking
  it("responds with error if incorrect password is provided", function (done) {
    request(app)
      .post("/api/auth")
      .send({
        password: "123456",
        email: "testperm@icloud.com",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.a("string");
        expect(res.body).to.contain.property("message");
        expect(res.body.message).to.equal(
          "The password must be 6 characters long or more."
        );
        done();
      })
      .catch((err) => done(err));
  });
  it("responds with error if incorrect username is provided", function (done) {
    request(app)
      .post("/api/auth")
      .send({
        password: "1234567",
        email: "wrong@icloud.co.uk",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.message).to.be.a("string");
        expect(res.body).to.contain.property("message");
        expect(res.body.message).to.equal(
          "There is no user record corresponding to this identifier. The user may have been deleted."
        );
        done();
      })
      .catch((err) => done(err));
  });
});

// tests translate word api call.
describe("GET /api/translate", () => {
  after(function (done) {
    server.close();
    done();
  });

  it("responds with translated word", function (done) {
    request(app)
      .get("/api/translate")
      .send({
        word: "cat",
        langpair: "en|fr",
      })
      .expect(200)
      .then((res) => {
        expect(res.body).to.an("object");
        expect(res.body).to.contain.property("message");
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("le chat");
        done();
      })
      .catch((err) => done(err));
  });
});

// tests association word api call. Responds with nouns only.
describe("GET /api/associations", () => {
  after(function (done) {
    server.close();
    done();
  });

  it("responds with translated word", function (done) {
    request(app)
      .get("/api/associations")
      .send({
        text: "house",
        lang: "en",
      })
      .expect(200)
      .then((res) => {
        expect(res.body).to.an("object");
        expect(res.body).to.contain.property("message");
        expect(res.body.message).to.have.all.keys("word", "wordsArray");
        expect(res.body.message.word).to.equal("house");
        expect(res.body.message.wordsArray).to.have.lengthOf(3);
        expect(res.body.message.wordsArray).to.be.an.instanceof(Array);
        res.body.message.wordsArray.forEach((word) => {
          expect(word.item).to.be.a("string");
        });
        done();
      })
      .catch((err) => done(err));
  });
});

// test authorised routes.
describe("POST /api/auth", () => {
  let token = "";
  after(function (done) {
    server.close();
    done();
  });
  before(function (done) {
    const { password, email } = testUsers;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user: { uid } }) => {
        admin
          .auth()
          .createCustomToken(uid)
          .then(function (customToken) {
            token = customToken;
            done();
          });
      })
      .catch((err) => done(err));
  });

  it("responds with a message on a test auth route", function (done) {
    request(app)
      .get("/api/auth/test")
      .set("token", token)
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("testasync@gmail.com");
        expect(res.body).to.contain.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

//test create a new user. FireBase Auth.
describe("POST /api/user", () => {
  after((done) => {
    const password = "1234567";
    const email = "test@icloud.com";
    //ensure user is logged in...
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        const { uid } = res.user;
        //assign loggedin user to current user
        const user = firebase.auth().currentUser;
        //delete current user
        user.delete().catch(function (error) {
          done(error);
          // delete from realtimeDB
        });
        const database = admin.database();
        const usersRef = database.ref("/users/" + uid);
        usersRef.remove();
      });
    server.close();
    done();
  });
  it("should create a user when passed an email address and password", (done) => {
    request(app)
      .post("/api/user")
      .send({
        name: "testuser1",
        password: "1234567",
        email: "test@icloud.com",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).to.have.all.keys("user", "token");
        expect(res.body.user).to.have.all.keys("name", "email");
        expect(res.body.user.email).to.be.a("string");
        expect(res.body.user.email).to.equal("test@icloud.com");
        done();
      })
      .catch((err) => done(err));
  });
});
