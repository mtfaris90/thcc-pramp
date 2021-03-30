const quizzes = require("../../data/quizzes.json");

/**
 * Returns a list of quizzes with titles and IDs
 */
async function getQuizzes(req, res, next) {
  try {
    const data = [];
    const subjects = await Object.keys(quizzes);
    for (const subject of subjects) {
      const { questions, ...result } = await quizzes[subject];
      data.push(result);
    }
    res.send(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
}

/**
 * Returns quiz data for the given ID, omitting the answers
 */
async function getQuiz(req, res, next) {
  const ident = req.params.id;
  try {
    const subjects = await Object.keys(quizzes);
    for (const subject of subjects) {
      const obj = await quizzes[subject];
      if (obj.id === ident) {
        // remove answers
        obj.questions.forEach((question) => {
          delete question.answer;
        });
        res.send(obj);
        return;
      }
    }
    res.sendStatus(404);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
}

/**
 * Handles a quiz submission and returns a graded result
 */
async function postQuiz(req, res, next) {
  const ident = req.params.id;
  const contents = req.body;
  try {
    const subjects = await Object.keys(quizzes);
    for (const subject of subjects) {
      const obj = await quizzes[subject];
      if (obj.id === ident) {
        const graded = { correct: 0, incorrect: 0, questions: {} };
        Object.keys(contents.answers).forEach((key) => {
          const index = Number(
            key[key.length - 1]
          ) - 1;
          const isCorrect =
            contents.answers[key] === obj.questions[index].answer;
          isCorrect ? (graded.correct += 1) : (graded.incorrect += 1);
          graded.questions[key] = isCorrect;
        });
        res.send(graded);
      }
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
}

module.exports = {
  getQuizzes,
  getQuiz,
  postQuiz,
};
