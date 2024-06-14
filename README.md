[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam #N: "Exam Title"
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
  - Request Body: { "username": "string", "password": "string" }
  - Response: { "message": "Login successful", "user": { "id": "integer", "username": "string" }}
  - response status codes:
      - 200: OK - Login successful.
      - 400: Bad Request - Invalid request body or missing parameters.
      - 401: Unauthorized - Incorrect username or password.

- POST /api/logout : Logs out the authenticated user and ends the session.
  - Request Body: None
  - Response: { "message": "Logout successful" }
  - Response Status Codes:
      - 200: OK - Logout successful.

- GET /api/memes: Retrieves a random meme with associated captions for a new game round.
  - request parameters: None
  - Response: { "memeId": "integer", "imageUrl": "string", "captions": ["string", "string", ...] }
  - response status codes:
      - 200: OK - Meme retrieved successfully.
      - 500: Internal Server Error - Server error while retrieving meme.

- GET /api/memes/captions: Retrieves all possible captions.
  - Query Parameters: None
  - Response: { "captions": ["string", "string", ...] }
  - response status codes:
      - 200: OK - Captions retrieved successfully.
      - 500: Internal Server Error - Server error while retrieving captions.

- POST /api/games:  Starts a new game for the authenticated user.
  - Request Body: None
  - Response: { "gameId": "integer", "rounds": [] }
  - response status codes:
      - 200: OK - New game started successfully.
      - 500: Internal Server Error - Server error while starting a new game.

- POST /api/games/rounds:  Starts a new round in an existing game.
  - Path Parameters: gameId (game ID), roundId (round ID)
  - Request Body: { "caption": "string" }
  - Response: { "correct": "boolean", "score": "integer", "bestCaptions": ["string", "string"] }
  - response status codes:
      - 200: OK - New round started successfully.
      - 400: Bad Request - Invalid request body or parameters.
      - 404: Not Found - Game or round not found.
      - 500: Internal Server Error - Server error while starting a new round.
      
- GET /api/users/profile: Retrieves the profile and game history of a user.
  - Path Parameters: userId (user ID)
  - Response: { "user": { "id": "integer", "username": "string" }, "games": [{ "gameId": "integer", "rounds": [{ "meme": "string", "score": "integer" }] }] }
  - response status code:
      - 200: OK - Profile and game history retrieved successfully.
      - 404: Not Found - User not found.
      - 500: Internal Server Error - Server error while retrieving profile.



## Database Tables

- Table `users` - short description of its contents
- Table `something` - short description of its contents
- ...


## Screenshots

![Screenshot1](./img/screenshot.jpg)

![Screenshot2](./img/screenshot.jpg)


## Users Credentials

- below is information about users:
- username, password, salt
- aliabbasi, aliabbasi (Hashed pass: f35e38aa664197a900eabaf78e288a97cbb1950d7c0ac61f556df4353a9cd0d0, Salt: 3b9f578ae406fcbb)
- user1, user1pass (Hashed pass: 23ef35c5e03b3dfe9f53b5c3dc22a39e25ea881062ff4a6da5e724a8bff549a3, Salt: e818f0647b4e1fe0)
