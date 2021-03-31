const { getQuizzes, getQuiz, postQuiz } = require("../routes");
const request = require("supertest");
const app = require("../index.js");

describe("API", () => {
  let currentServer;

  beforeEach(() => {
    const port = process.env.PORT || 3000;
    currentServer = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });

  afterEach(() => {
    currentServer.close();
  });

  describe("getQuizzes", () => {
    it("returns a list of quizzes", async () => {
      await request(currentServer)
        .get("/api/quizzes")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          const data = response.body;
          expect(Array.isArray(data)).toBeTruthy();
        });
    });
  });

  describe("getQuiz", () => {
    it("returns the data for a quiz", async () => {
      await request(currentServer)
        .get("/api/quizzes/math")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          const data = response.body;
          expect(data.title).toBe("Basic Math Quiz");
        });
    });

    it("returns a 404 if the quiz cannot be found", async () => {
      await request(currentServer).get("/api/quizzes/history").expect(404);
    });
  });

  describe("postQuiz", () => {
    it("returns the 3 incorrect grades for the wrong quiz submission", async () => {
      await request(currentServer)
        .post("/api/quizzes/math/attempt")
        .send({
          answers: {
            question_1: "True",
            question_2: "Dangling participle",
            question_3: "their",
          },
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          const data = response.body;
          expect(data.incorrect).toBe(3);
        });
    });

    it("returns the 3 correct grades for the perfect quiz submission", async () => {
      await request(currentServer)
        .post("/api/quizzes/english/attempt")
        .send({
          answers: {
            question_1: "True",
            question_2: "Dangling participle",
            question_3: "their",
          },
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          const data = response.body;
          expect(data.correct).toBe(3);
        });
    });
  });
});
