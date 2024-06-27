// import
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, validationResult, body } from 'express-validator';
import {getUser} from './dao/user-dao.mjs';
import { getRandomMeme,getCaptionsByMemeId } from './dao/meme-dao.mjs';
import {getGamesByUserId, saveGameResults} from './dao/game-dao.mjs';
import bodyParser from 'body-parser';

// Passport-related imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
// for handling sessions management
import session from 'express-session';

// init
const app = express();
const port = 3001;

// register the middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());


// enabling cors to accept security credentials from the origin http://localhost:5173(react app URL)
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));



// Passport: set up local strategy 
// When the passport knows when to check the login and password, it will call this verify function.
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));


//stroe into the session the user information
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

//extract the user unformation from the session
passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});


// checking is authenticated
// we use this middleware on every API that needs to be protected
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


// Telling express to use session (cookies)
app.use(session({
  secret: "it's a very very private secret!",
  resave: false,
  saveUninitialized: false,
}));

// Telling passport to store authentication information in the session
app.use(passport.authenticate('session'));




/* ---------ROUTES---------- */


// POST /api/sessions
app.post('/api/sessions', [
  // Validate username and password
  check('username', 'Username is required').notEmpty(),
  check('password', 'Password is required').notEmpty(),
  ], (req, res, next) => {

  // Find the validation errors in this request and wrap them in an object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // This function is called only if the authentication was successful
  // req.user contains the authenticated user
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});


// GET /api/sessions/current 
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});


// DELETE /api/session/current - Log out
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});



// GET /api/meme: Retrieves a random meme
app.get('/api/meme', async (req, res) => {
  try {
    const meme = await getRandomMeme();
    if (meme) {
      res.json(meme);
    } else {
      res.status(404).json({ error: 'No meme found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve a meme' });
  }
});


//  GET /api/meme/:memeId/captions: Retrieves seven possible captions for a given meme.
app.get('/api/meme/:memeId/captions', [
  // Validate memeId
  check('memeId').isInt({ min: 1, max: 10 }).withMessage('Meme ID must be a valid integer between 1 and 10'),
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const memeId = req.params.memeId;
  try {
    const captions = await getCaptionsByMemeId(memeId);
    res.status(200).json({ captions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve Captions' });
  }
});



// --------------------APIs for Authenticated User-----------------

// GET /api/users/profile: Get Profile of user consist of games and rounds
// *Protected API
app.get('/api/users/profile', isLoggedIn, async (req, res) => {
  const { user_id } = req.query;
  // console.log(`Received request for user_id: ${user_id}`); // Debug log
  try {
    const gamesinfo = await getGamesByUserId(user_id);
    // console.log('Fetched gamesinfo:', gamesinfo); // Debug log
    res.json({
      games: gamesinfo
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});



// POST /api/submitGameResults: Save game results on the server
// *Protected API
app.post('/api/submitGameResults',isLoggedIn, [
  // Validate GameData
  body().isArray().withMessage('Game data should be an array'),
  body('*.userId').isInt().withMessage('User ID should be an integer'),
  body('*.round').isInt().withMessage('Round should be an integer'),
  body('*.meme_id').isInt().withMessage('Meme ID should be an integer'),
  body('*.selected_caption_id').isInt().withMessage('Selected caption ID should be an integer'),
  body('*.score').isInt().withMessage('Score should be an integer'),
  body().custom((value) => {
    if (value.length < 1 || value.length > 3) {
      throw new Error('Array length should be between 1 and 3');
    }
    return true;
  })
  ] ,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const gameData = req.body;
    try {
      await saveGameResults(gameData);
      res.status(200).json({ message: 'Game results saved successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Error saving game results: ' + err.message });
    }
  });

// ----------------------------------------------------------------

// start the server
export const startServer = () => {
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });
}