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
    user
      .delete()
      .catch(function (error) {
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

  it("responds with logged in user", function (done) {
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
