const quizzes = require("../../data/quizzes.json");

/**
 * Returns a list of quizzes with titles and IDs
 */
async function getQuizzes(req, res, next) {
  try {
    const data = []; // response array to be filled
    const subjects = await Object.keys(quizzes); // obtain subjects from mock database
    for (const subject of subjects) {
      const { questions, ...result } = await quizzes[subject]; // collect relevant data w/ obj destructuring and spread operator
      data.push(result); // add relevant data to array
    }
    res.send(data); // send filled array
  } catch (err) {
    console.log(`Error Processing Request: ${err}`);
    res.sendStatus(500);
  }
}

/**
 * Returns quiz data for the given ID, omitting the answers
 */
async function getQuiz(req, res, next) {
  const reqID = req.params.id;
  try {
    const subjects = await Object.keys(quizzes); // obtain subjects from mock database
    for (const subject of subjects) {
      const obj = await quizzes[subject];  // obtain data object for subject
      if (obj.id === reqID) { // when subject id matches request id
        obj.questions.forEach((question) => {
          delete question.answer; // remove answers
        });
        res.send(obj); // send remaining info
        return;
      }
    }
    res.sendStatus(404); // if not found, send 404
  } catch (err) {
    console.log(`Error Processing Request: ${err}`);
    res.sendStatus(500);
  }
}

/**
 * Handles a quiz submission and returns a graded result
 */
async function postQuiz(req, res, next) {
  const reqID = req.params.id;
  const contents = req.body;
  try {
    const subjects = await Object.keys(quizzes); // obtain subjects from mock database
    for (const subject of subjects) {
      const obj = await quizzes[subject]; // obtain data object for subject
      if (obj.id === reqID) { // when subject id matches request id
        const graded = { correct: 0, incorrect: 0, questions: {} }; // create response object
        Object.keys(contents.answers).forEach((key) => {
          const index = Number(
            key[key.length - 1]
          ) - 1; // determine last char of key
          const isCorrect =
            contents.answers[key] === obj.questions[index].answer; // determine if answer matches answer key
          isCorrect ? (graded.correct += 1) : (graded.incorrect += 1); // increment correct/incorrect accordingly
          graded.questions[key] = isCorrect;
        });
        res.send(graded); // send response object
        return;
      }
    }
    res.sendStatus(404); // if not found, send 404
  } catch (err) {
    console.log(`Error Processing Request: ${err}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getQuizzes,
  getQuiz,
  postQuiz,
};
