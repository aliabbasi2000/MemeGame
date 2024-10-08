[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam 1: "Exam Title: What do you meme? "
## Student: ABBASI ALI 

## Game Rules
Design and implement a web application for playing a single-player version of the "What do you meme?" board game.

In the game, the player receives a random meme picture and seven possible captions for that meme: the player needs to guess the “right” caption for the meme.

The game is based on an archive of several meme pictures. Each meme picture is associated with at least two captions that best match the picture. It is possible for a caption to be associated with more than one picture. Students are free to use the memes and the captions they prefer.

The gameplay works in several rounds. Each round proposes a meme, as follows:

1. The player receives a random meme picture and seven possible captions for that meme in random order. Both the random meme picture and the captions must be generated by the server. Among the seven captions, two of them must be among the set of best-matching captions for that meme picture.

2. The player must select a caption that best fits the meme within 30 seconds.

3. If the player selects one of the two most appropriate captions for the meme within 30 seconds, he/she  gets 5 points and a message reports the end of the round.

4. If the player selects one of the other captions or the time expires, he/she gets 0 points. In this case, the application shows a suitable message together with the two captions that are the best match for the given meme.

Registered (i.e., logged-in) users will play a game composed of 3 rounds. In addition, all their games and rounds are recorded at the end of the game, the history of their scores is visible in the user profile page. The history should show all meme pictures, with their obtained score (0 or 5), the score for the game, and the total score of all games.
The same meme cannot be repeated in different rounds of the same game, but it might be repeated in different games.
After 3 rounds, the game stops, and the total score of this game is displayed, together with a summary of the correctly matched memes and their selected captions. If the game is not completed by the user, it is not recorded, and no points are assigned.

Anonymous users, instead, may only play one-round games. They won’t have access to any functionality of registered users.
After the end of the game, the player may re-start a new game.

## Running the Application
The project must be started by running the two commands: `cd server; nodemon index.mjs` and `cd client; npm run dev`.

## Project requirements
- The application architecture and source code must be developed by adopting the best practices in software development, in particular, those relevant to single-page applications (SPA) using React and HTTP APIs.
- The application should be designed for a desktop browser. Responsiveness for mobile devices is not required nor evaluated.
- The project must be implemented as a React application that interacts with an HTTP API implemented in Node+Express. The Node version must be the one used during the course (20.x, LTS). The database must be stored in a SQLite file. The programming language must be JavaScript.
- The communication between client and server must follow the “two servers” pattern, by properly configuring CORS, and React must run in “development” mode with Strict Mode activated.
- The project must not include the node_modules directories. They will be re-created by running the “npm install” command right after “git clone”.
- The project may use popular and commonly adopted libraries (for example, day.js, react-bootstrap, etc.), if applicable and useful. All required libraries must be correctly declared in the package.json file, so that the npm install command might install them.
- User authentication (login and logout) and API access must be implemented with Passport.js and session cookies. The credentials should be stored in encrypted and salted form. The user registration procedure is not requested nor evaluated.


## React Client Application Routes

- Route `/`: Home page - consists of a start button to start the game & Login Button
- Route `/Login`: Login page - consists of a login form to perform Authentication
- Route `/demogame`: Demo Game Page - The game page for the anonymous user
- Route `/game`: Game Page - The game page for the Authenticated user
- Route `/profile`: user profile Page - consists of the Games that the user played before and the meme and the score of them for each round


![routes](/img/design/routes.PNG)

## Main React Components 

- `LoginForm` (in `AuthComponents.jsx`): Component: A Login Form -> perform login
- `MemeGame` (in `MemeGame.jsx`):  Component: A Game Card Containing the Meme img and the Captions Component  ->  fetch the image URL from the server and display - **For Anonymous User**
- `Captions` (in `Captions.jsx`): Component: 7 Captions -> get the meme ID from Father component(MemeGame) and fetch an API to get 7 cptions to that meme ID. User can select one Caption in 30 sec and see the result. - **For Anonymous User**
- `Game` (in `Game.jsx`): Component: A Game consists of 3 rounds. each round consists of a meme img and 7 possible captions and a 30sec timer in which the user can select one caption in this time and the score for each game will be calculated. -> 3 functions to fetch API: 1.get a random meme 2.get 7 captions for that meme ID 3. submit the results after final round. - **For Authenticated User**
- `GameSummary` (in `GameSummary.jsx`): Component: A summary consists of the memes that are Selected correctly with the selected captions -> Gets the total score and the correctly guessed memes from the father component(Game) and displays them. - **For Authenticated User**
- `Profile` (in `Profile.jsx`):  Component: A profile Page consists of username of the user, total score, and the history of all the games played(At least one round should be played to be recorded in our history) -> fetch an API to get the user data and calculate the total score of all the games - **For Authenticated User**

NOTE: The Validation of the selected Captions is not happening in the Server. From the list of 7 captions that are sent from the server side, the first 2 are the correct captions.



## API Server

**Public APIs**

- POST /api/sessions: Authenticates a user and starts a session.
  - Request Body: { username: string, password: string }
  - Response: { message: Login successful, user: { id: integer, username: string }}
  - response status codes:
      - 200: OK - Login successful.
      - 401: Unauthorized - Incorrect username or password.

- GET /api/sessions/current: Retrieves the current authenticated user's session.
  - Response: { id: integer, username: string }
  - Response Status Codes:
      - 200: OK - User is authenticated.
      - 401: Unauthorized - Not authenticated.

- DELETE  /api/sessions/current: Logs out the authenticated user and ends the session.
  - Request Body: None
  - Response: None
  - Response Status Codes:
      - 200: OK - Logout successful.

- GET /api/meme: Retrieves a random meme.
  - request parameters: None
  - Response: { meme: { id: integet, url: string } }
  - response status codes:
      - 200: OK - Meme retrieved successfully.
      - 404: Not Found - No meme found.
      - 500: Internal Server Error - Failed to retrieve a meme.

- GET /api/meme/captions: Retrieves seven possible captions for a given meme.
  - request Parameters: memeId
  - Response: { captions: [{ id: integer, text: string }, { id: integer, text: string },...] }
      - 200: OK - Captions retrieved successfully.
      - 500: Internal Server Error - Failed to retrieve captions.

**Protected APIs**

- GET /api/users/profile?user_id=1: Retrieves the profile information and game history of the authenticated user.
  - Request Query: ?user_id=integer
  - Response: { games: [{ gameId: integer, rounds: [{ roundId: integer, selected_caption_id: integer, score: integer, meme_url: string }, ...] }] }
  - response status code:
      - 200: OK - Profile retrieved successfully.
      - 500: Internal Server Error - Failed to fetch user profile.

- POST /api/submitGameResults: Saves game results on the server.
  - Request Body: { userId: integer, round: integer, meme_id: integer, selected_caption_id: integer, score: integer] }
  - Response Status Codes:
      - 200: OK - Game results saved successfully.
      - 500: Internal Server Error - Error saving game results.




## Database Tables

- Table `users` - has the user information
  - id, username, password, salt
- Table `memes` - has the id of meme and a url of the meme image in the public folder of the client
  - id, url
- Table `captions` - has the id of captions and the text of it
  - id, caption
- Table `meme_caption` - a middle table thatShows the N to N relationship between captions and memes
  - meme_id, caption_id
- Table `games` - has the games for the users
  - id, user_id
- Table `rounds` - has the information of rounds
  - id, game_id, meme_id, selected_caption_id, score

![database](/img/design/db.PNG)

## Screenshots

![Screenshot1](/img/screenshots/screenshot1.png)

![Screenshot2](/img/screenshots/screenshot2.png)


## Users Credentials

- Below is the Credentials of 2 users:

- 1 - **username:** aliabbasi, **password:** aliabbasi 
(Hashed pass: f35e38aa664197a900eabaf78e288a97cbb1950d7c0ac61f556df4353a9cd0d0, Salt: 3b9f578ae406fcbb)

- 2 -  **username:** user1, **password:** user1 
(Hashed pass: 23ef35c5e03b3dfe9f53b5c3dc22a39e25ea881062ff4a6da5e724a8bff549a3, Salt: e818f0647b4e1fe0)
