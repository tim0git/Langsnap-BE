const { app, server } = require("../server");
const request = require("supertest");
const {
  createUser,
  generateToken,
  signIn,
  deleteCurrentUser,
} = require("../models/firebase.model");

//Chai config,
const expect = require("chai").expect;

//test express router for /api
describe("GET /api", () => {
  after((done) => {
    server.close();
    done();
  });

  it("responds with all available endpoints", (done) => {
    request(app)
      .get("/api")
      .then(({ body }) => {
        expect(body).to.contain.property("availableEndpoints");
        expect(body.availableEndpoints).to.be.an("object");
        done();
      })
      .catch((err) => done(err));
  });

  it("status: 404 responds with 'Resource not found.' if page doesn't exist", (done) => {
    request(app)
      .get("/incorrect_path")
      .expect(404)
      .then(({ body: { availableRoutes } }) => {
        expect(availableRoutes.message).to.deep.equal("Resource not found.");
        done();
      });
  });
});

describe("POST /api/auth", () => {
  describe("/", () => {
    describe("tests logging into a users account. FireBase Auth.", () => {
      after((done) => {
        server.close();
        done();
      });

      it("responds with a token if correct email and password are provided", (done) => {
        request(app)
          .post("/api/auth")
          .send({
            password: "1234567",
            email: "postmanPat1@gmail.com",
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.token).to.be.a("string");
            expect(body).to.have.all.keys("token", "user");
            expect(body.user).to.have.all.keys("email", "name", "words");
            done();
          })
          .catch((err) => done(err));
      });

      //error checking
      it("responds with error if incorrect password is provided", (done) => {
        request(app)
          .post("/api/auth")
          .send({
            password: "123456",
            email: "testasync@gmail.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.be.a("string");
            expect(body).to.contain.property("message");
            expect(body.message).to.deep.equal(
              "The password must be 6 characters long or more."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("responds with error if incorrect email is provided", (done) => {
        request(app)
          .post("/api/auth")
          .send({
            password: "1234567",
            email: "wrong@icloud.co.uk",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.be.a("string");
            expect(body).to.contain.property("message");
            expect(body.message).to.deep.equal(
              "There is no user record corresponding to this identifier. The user may have been deleted."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status 400: responds with error if no password provided", (done) => {
        request(app)
          .post("/api/auth")
          .send({
            password: "",
            email: "testperm@icloud.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "The password must be 6 characters long or more."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status 400: responds with error if no email address provided", (done) => {
        request(app)
          .post("/api/auth")
          .send({
            password: "1234567",
            email: "",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "The email address is badly formatted."
            );
            done();
          })
          .catch((err) => done(err));
      });
    });
  });

  describe("/test", () => {
    describe("test authorised routes.", () => {
      let token = "";
      after((done) => {
        server.close();
        done();
      });

      before("Generate token for test routes", async () => {
        const email = "testasync@gmail.com";
        const password = "1234567";
        try {
          const uid = await signIn(email, password);
          const customToken = await generateToken(uid);
          token = customToken;
        } catch (error) {
          console.log(error);
        }
      });

      it("responds with a users email on a test auth route", (done) => {
        request(app)
          .get("/api/auth/test")
          .set("x-auth-token", token)
          .expect(200)
          .then(({ body }) => {
            expect(body.message).to.be.a("string");
            expect(body.message).to.deep.equal("testasync@gmail.com");
            expect(body).to.contain.property("message");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("test create a new user. FireBase Auth.", () => {
      let globalToken = "";
      let globalUid = "";

      before("Create User and set Gobal Token", async () => {
        const email = "testyAutoSignIn@gmail.com";
        const password = "1234567";
        try {
          const res = await createUser(email, password);

          const uid = res.user.uid;

          const token = await generateToken(uid);

          globalToken = token;
          globalUid = uid;
        } catch (error) {
          console.log(error);
        }
      });

      after("Delete user testyAutoSignIn", async () => {
        const email = "testyAutoSignIn@gmail.com";
        const password = "1234567";
        try {
          await signIn(email, password);

          await deleteCurrentUser();
        } catch (error) {
          console.log(error);
        }
        server.close();
      });

      it("should be able to access routes with token from sign up", (done) => {
        request(app)
          .get("/api/auth/test")
          .set("x-auth-token", globalToken)
          .then((res) => {
            expect(res.body.message).to.deep.equal("testyautosignin@gmail.com");
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
});

describe("POST /api/user", () => {
  describe("/", () => {
    describe("create a new user. FireBase Auth.", () => {
      afterEach("Delete test user after test", async () => {
        const password = "1234567";
        const email = "test@icloud.com";
        try {
          const uid = await signIn(email, password);
          await deleteCurrentUser(uid);
        } catch (error) {
          console.log(error);
        }
        server.close();
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
          .then(({ body }) => {
            expect(body).to.have.all.keys("user", "token");
            expect(body.user).to.have.all.keys("name", "email");
            expect(body.user.email).to.be.a("string");
            expect(body.user.email).to.deep.equal("test@icloud.com");
            done();
          })
          .catch((err) => done(err));
      });
    });

    describe("tests errors for creating a new user. FireBase Auth", () => {
      it("status: 400. error if password is under seven characters long", (done) => {
        request(app)
          .post("/api/user")
          .send({
            name: "testuser1",
            password: "12345",
            email: "test@icloud.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "The password must be 6 characters long or more."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error if no name given", (done) => {
        request(app)
          .post("/api/user")
          .send({
            name: "",
            password: "123456",
            email: "test@icloud.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal("Name required.");
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error if no email address given", (done) => {
        request(app)
          .post("/api/user")
          .send({
            name: "testuser1",
            password: "123456",
            email: "",
          })
          .then(({ body }) => {
            expect(body.message).to.equal(
              "The email address is badly formatted."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. Error when invalid email passed", (done) => {
        request(app)
          .post("/api/user")
          .send({
            name: "testuser1",
            password: "123456",
            email: "@",
          })
          .then(({ body }) => {
            expect(body.message).to.equal(
              "The email address is badly formatted."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error if no password given", (done) => {
        request(app)
          .post("/api/user")
          .send({
            name: "testuser1",
            password: "",
            email: "test@icloud.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "The password must be 6 characters long or more."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when user already exists", (done) => {
        request(app)
          .post("/api/user")
          .send({
            name: "testuser1",
            password: "1234567",
            email: "testperm@icloud.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "The email address is already in use by another account."
            );
            done();
          })
          .catch((err) => done(err));
      });

      after(() => {
        server.close();
      });
    });
  });

  describe("/words", () => {
    describe("Add a word to a users database. FireBase authenticated", () => {
      let globalToken = "";
      before(async () => {
        try {
          const email = "postmanPat10@gmail.com";
          const password = "1234567";
          const uid = await signIn(email, password);
          const token = await generateToken(uid);
          globalToken = token;
        } catch (error) {
          console.log(error);
        }
      });

      after((done) => {
        server.close();
        done();
      });

      it("status: 200. return wordsList.", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "cat",
            language: "German",
            translatedWord: "die Katze",
          })
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.property("wordsList");
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 200. word is added to users words list.", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "cat",
            language: "German",
            translatedWord: "die Katze",
          })
          .expect(200)
          .then(({ body }) => {
            const includes = Object.entries(body.wordsList).some(
              ([key, pair]) => {
                return pair["German"]["cat"] === "die Katze";
              }
            );
            expect(includes).to.deep.equal(true);
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when missing englishWord property on request body", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            language: "German",
            translatedWord: "die Katze",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "Must have a valid language, englishWord, translatedWord in order to be stored in the database."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when missing language property on request body", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "cat",
            translatedWord: "die Katze",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "Must have a valid language, englishWord, translatedWord in order to be stored in the database."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when missing translatedWord property on request body", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "cat",
            language: "German",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "Must have a valid language, englishWord, translatedWord in order to be stored in the database."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when englishWord property is an empty string", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "",
            language: "German",
            translatedWord: "die Katze",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "Must have a valid language, englishWord, translatedWord in order to be stored in the database."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when language property is an empty string", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "cat",
            language: "",
            translatedWord: "die Katze",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "Must have a valid language, englishWord, translatedWord in order to be stored in the database."
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("status: 400. error when translatedWord property is an empty string", (done) => {
        request(app)
          .post("/api/user/words")
          .set("x-auth-token", globalToken)
          .send({
            englishWord: "cat",
            language: "German",
            translatedWord: "",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.deep.equal(
              "Must have a valid language, englishWord, translatedWord in order to be stored in the database."
            );
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
});

describe("POST /api/translate", () => {
  describe("tests translate word api call.", () => {
    after((done) => {
      server.close();
      done();
    });

    it("responds with translated word", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: "cat",
          langpair: "en|fr",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.an("object");
          expect(body).to.contain.property("message");
          expect(body.message).to.be.a("string");
          expect(body.message).to.deep.equal("le chat");
          done();
        })
        .catch((err) => done(err));
    });

    it("responds with translated word", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: "wall clock",
          langpair: "en|de",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.an("object");
          expect(body).to.contain.property("message");
          expect(body.message).to.be.a("string");
          expect(body.message).to.deep.equal("Wanduhr");
          done();
        })
        .catch((err) => done(err));
    });

    it("status 200: responds with translated word regardless which way round the langpair is", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: "cat",
          langpair: "fr|en",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.message).to.deep.equal("chat");
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("errors for tests translate word api call.", () => {
    after((done) => {
      server.close();
      done();
    });

    it("status 400: responds with an error when word is an empty string", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: "",
          langpair: "en|fr",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal("Must have valid word and langpair.");
          done();
        })
        .catch((err) => done(err));
    });

    it("status 400: responds with an error when input is not a string", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: 123,
          langpair: "en|fr",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal("Invalid word.");
          done();
        })
        .catch((err) => done(err));
    });

    it("status 400: responds with an error when langpair is not a string", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: "cat",
          langpair: 123,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal("Must have valid word and langpair.");
          done();
        })
        .catch((err) => done(err));
    });

    it("status 400: responds with an error when langpair is invalid", (done) => {
      request(app)
        .post("/api/translate")
        .send({
          word: "cat",
          langpair: "invalid",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal("Must have valid word and langpair.");
          done();
        })
        .catch((err) => done(err));
    });
  });
});

describe("POST /api/associations", () => {
  describe("tests association word api call. Responds with nouns only.", () => {
    after((done) => {
      server.close();
      done();
    });

    it("responds with an array of 3 words", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "house",
          lang: "en",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.an("object");
          expect(body).to.contain.property("message");
          expect(body.message).to.have.all.keys("word", "wordsArray");
          expect(body.message.word).to.deep.equal("house");
          expect(body.message.wordsArray).to.have.lengthOf(3);
          expect(body.message.wordsArray).to.be.an.instanceof(Array);
          body.message.wordsArray.forEach((word) => {
            expect(word.item).to.be.a("string");
          });
          done();
        })
        .catch((err) => done(err));
    });

    it("responds with an array of 3 words with the filter applied", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "house",
          lang: "en",
          filter: "adjective",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.an("object");
          expect(body).to.contain.property("message");
          expect(body.message).to.have.all.keys("word", "wordsArray");
          expect(body.message.word).to.deep.equal("house");
          expect(body.message.wordsArray).to.have.lengthOf(3);
          expect(body.message.wordsArray).to.be.an.instanceof(Array);
          body.message.wordsArray.forEach((word) => {
            expect(word.pos).to.equal("adjective");
          });
          done();
        })
        .catch((err) => done(err));
    });

    it("responds with an array of 3 words with the filter equal to null ", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "house",
          lang: "en",
          filter: "",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.an("object");
          expect(body).to.contain.property("message");
          expect(body.message).to.have.all.keys("word", "wordsArray");
          expect(body.message.word).to.deep.equal("house");
          expect(body.message.wordsArray).to.have.lengthOf(3);
          expect(body.message.wordsArray).to.be.an.instanceof(Array);
          body.message.wordsArray.forEach((word) => {
            expect(word.item).to.be.a("string");
          });
          done();
        })
        .catch((err) => done(err));
    });

    it("status: 200. Word given is in the wrong language", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "Käse",
          lang: "en",
          filter: "",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.message.wordsArray).to.have.lengthOf(0);
          done();
        })
        .catch((err) => done(err));
    });

    it("status :400. Missing text property", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          lang: "en",
          filter: "",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.deep.equal(
            "Must have a valid language and input text."
          );
          done();
        })
        .catch((err) => done(err));
    });

    it("status :400. Missing lang property", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "house",
          filter: "",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.deep.equal(
            "Must have a valid language and input text."
          );
          done();
        })
        .catch((err) => done(err));
    });

    it("status :400. text property is empty string", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "",
          lang: "en",
          filter: "",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.deep.equal(
            "Must have a valid language and input text."
          );
          done();
        })
        .catch((err) => done(err));
    });

    it("status :400. lang property is empty string", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "house",
          lang: "",
          filter: "",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.deep.equal(
            "Must have a valid language and input text."
          );
          done();
        })
        .catch((err) => done(err));
    });

    it("status: 400. filter isn't valid", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "chair",
          lang: "en",
          filter: "womble",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.deep.equal(
            "Filter must equal noun, adjective, verb or adverb"
          );

          done();
        })
        .catch((err) => done(err));
    });

    it("status: 400. filter isn't a string", (done) => {
      request(app)
        .post("/api/associations")
        .send({
          text: "chair",
          lang: "en",
          filter: 123,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.deep.equal(
            "Filter must equal noun, adjective, verb or adverb"
          );

          done();
        })
        .catch((err) => done(err));
    });
  });
});
