[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam #1: "Exam Title: What do you meme?" board game."
## Student: s323638 ABBASI ALI 

## React Client Application Routes

- Route `/`: Home page - consist of a start button to start the game & Login Button
- Route `/Login`: Login page - consist of a login form to perform Authentication
- Route `/demogame`: Demo Game Page - The gane page for the annonimous user
- Route `/game`: Game Page - The gane page for the Authenticated user
- Route `/profile`: user profile Page - consist of the Games that user played before and the meme and the score of them for each round
- Route `/something/:param`: page content and purpose, param specification
- ...

![routes](/img/design/routes.PNG)

## Main React Components 

- `LoginForm` (in `AuthComponents.jsx`): Component: A Login Form -> perform login
- `MemeGame` (in `MemeGame.jsx`):  Component: A Game Card Containing the Meme img and the Captions Component  ->  fetch the image URL from the server and display - **For Anonymous User**
- `Captions` (in `Captions.jsx`): Component: 7 Captions -> get the meme ID from Father component(MemeGame) and fetch an API to get 7 cptions to that meme ID. User can select one Caption in 30 sec and see the result. - **For Anonymous User**
- `Game` (in `Game.jsx`): Component: A Game consist of 3 rounds that each round is consist of meme img and the captions and a 30sec timer that user can select one caption in this time and the score for each game will be calculated. -> 3 functions to fetch API: 1.get a random meme 2.get 7 captions for that meme ID 3.submir the results after final round. - **For Authenticated User**
- `GameSummary` (in `GameSummary.jsx`): Component: A summary consist of the memes that Selected correctly with the selected captions -> Gets the total score and the correctly guessed memes from the father component(Game) and display them. - **For Authenticated User**
- `Profile` (in `Profile.jsx`):  Component: A profile Page consist of username of user, total score, and the history of all the games played(At least one round shoud be played to be recorded in our history) -> fetch an api to get the user data and calculate the total score of all the games - **For Authenticated User**

NOTE: The Validation of the selected Captions are not happening in the Server. From the list of 7 captions that are sent from the server side, the first 2 are the correct captions.



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

- GET /api/users/profile: Retrieves the profile information and game history of the authenticated user.
  - Request Query: ?user_id=integer
  - Response: { games: [{ gameId: integer, rounds: [{ roundId: integer, score: integer }] }] }
  - response status code:
      - 200: OK - Profile retrieved successfully.
      - 500: Internal Server Error - Failed to fetch user profile.

 - POST /api/submitGameResults: Saves game results on the server.
  - Request Body: { userId: integer, gameId: integer, rounds: [{ roundId: integer, score: integer }] }
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

- Below is Credentials of 2 users:

- 1 - **username**: aliabbasi, **password**: aliabbasi 
(Hashed pass: f35e38aa664197a900eabaf78e288a97cbb1950d7c0ac61f556df4353a9cd0d0, Salt: 3b9f578ae406fcbb)

- 2 -  **username**: user1, **password**: user1 
(Hashed pass: 23ef35c5e03b3dfe9f53b5c3dc22a39e25ea881062ff4a6da5e724a8bff549a3, Salt: e818f0647b4e1fe0)
