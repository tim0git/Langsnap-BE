const firebase = require("firebase");
const { app, server } = require("../server");
const request = require("supertest");

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

//test create a new user. FireBase Auth.
describe("POST /api/user", () => {
  after(function (done) {
    let user = firebase.auth().currentUser;
    user.delete().catch(function (error) {
      console.log(error);
    });
    server.close();
    done();
  });

  it("should create a user when passed an email address and password", (done) => {
    request(app)
      .post("/api/user")
      .send({
        password: "1234567",
        email: "test@icloud.com",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.result).to.contain.property("user");
        expect(res.body.result.user.email).to.be.a("string");
        expect(res.body.result.user.email).to.equal("test@icloud.com");
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

  it("responds with logged in user if emai and password are correct", function (done) {
    request(app)
      .post("/api/auth")
      .send({
        password: "1234567",
        email: "testperm@icloud.com",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.result).to.an("object");
        expect(res.body.result).to.contain.property("user");
        expect(res.body.result.user.email).to.be.a("string");
        expect(res.body.result.user.email).to.equal("testperm@icloud.com");
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

// tests association word api call. Responds only with nouns.
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
