## Assignment Notes

- I treated all interactions with quizzes.json as async database requests.
- I extracted some logic from src/index.js into server.js so I could test the server in a way I was most comfortable with.
- I made server.js the new entrypoint for `npm start` in package.json.
- I added tests to handle additional types of requests and failures.
- I was a little unsure how the example request/response for POST `/api/quizzes/:id/attempt` would make use of a numbered id parameter. I instead used the quiz id name in my implementation.
