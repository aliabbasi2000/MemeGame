[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam #N: "Exam Title: What do you meme?" board game."
## Student: s323638 ABBASI ALI 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)


## API Server

- POST /api/login: Authenticates a user and starts a session.
  - Request Body: { username: string, password: string }
  - Response: { message: Login successful, user: { id: integer, username: string }}
  - response status codes:
      - 200: OK - Login successful.
      - 400: Bad Request - Invalid request body or missing parameters.
      - 401: Unauthorized - Incorrect username or password.

- POST /api/logout : Logs out the authenticated user and ends the session.
  - Request Body: None
  - Response: { message: Logout successful }
  - Response Status Codes:
      - 200: OK - Logout successful.

- GET /api/meme: Retrieves a random meme picture.
  - request parameters: None
  - Response: { meme: { id: integet, url: string } }
  - response status codes:
      - 200: OK - Meme retrieved successfully.
      - 500: Internal Server Error - Server error while retrieving meme.

- GET /api/meme/captions: Retrieves seven possible captions for a given meme picture.
  - request Parameters: memeId
  - Response: { captions: [{ id: integer, text: string }, { id: integer, text: string },...] }
      - 200: OK - Captions retrieved successfully.
      - 500: Internal Server Error - Server error while retrieving captions.


- GET /api/users/profile: Retrieves the profile information and game history of the authenticated user.
  - Path Parameters: userId (user ID)
  - Response: { user: { id: integer, username: string, totalScore: integer }, games: [{ id: integer, date: string, score: integer, rounds: [{ meme: { id: integer, url: string }, score: integer, correctCaption: string, guessedCaption: string }] }] }
  - response status code:
      - 200: OK - Profile and game history retrieved successfully.
      - 404: Not Found - User not found.
      - 500: Internal Server Error - Server error while retrieving profile.



- POST /api/game/start:  Starts a new game for the authenticated user.
  - Request Body: None
  - Response: { gameId: integer, meme: { id: integer, url: string }, captions: [{ id: integer, text: string }] }
  - response status codes:
      - 200: OK - New game started successfully.
      - 500: Internal Server Error - Server error while starting a new game.

- POST /api/game/round:  Starts a new round in an existing game.
  - Path Parameters: gameId,
  - Request Body: None
  - Response:{ round: integer, meme: { id: integer, url: string }, captions: [{ id: integer, text: string }] }
  - response status codes:
      - 200: OK - New round started successfully.
      - 400: Bad Request - Invalid request body or parameters.
      - 404: Not Found - Game or round not found.
      - 500: Internal Server Error - Server error while starting a new round.


- POST /api/game/round/guess:  Submits a guess for a round.
  - Path Parameters: gameId, roundId 
  - Request Body: { captionId: integer }
  - Response:{ correct: boolean, score: integer, bestCaptions: [{ id: integer, text: string }] }
  - response status codes:
      - 200: OK - The guess was successfully processed. (It was Correct OR Incorrect)
      - 400: Bad Request - Invalid request body or parameters.
      - 404: Not Found - Game or round not found.
      - 500: Internal Server Error - Server error while starting a new round.

      




## Database Tables

- Table `users` - has the user information
  - id, username, password, salt
- Table `memes` - has the id of meme and a url of the meme image in the public folder of the client
  - id, url
- Table `captions` - has the id of captions and the text of it
  - id, caption
- Table `meme_caption` - a middle table thatShows the N to N relationship between captions and memes
  - meme_id, caption_id


## Screenshots

![Screenshot1](./img/screenshot.jpg)

![Screenshot2](./img/screenshot.jpg)


## Users Credentials

- below is information about users:
- username, password, salt
- aliabbasi, aliabbasi (Hashed pass: f35e38aa664197a900eabaf78e288a97cbb1950d7c0ac61f556df4353a9cd0d0, Salt: 3b9f578ae406fcbb)
- user1, user1pass (Hashed pass: 23ef35c5e03b3dfe9f53b5c3dc22a39e25ea881062ff4a6da5e724a8bff549a3, Salt: e818f0647b4e1fe0)
