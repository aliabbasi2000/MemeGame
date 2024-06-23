// import
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, validationResult} from 'express-validator';
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
app.post('/api/sessions', function(req, res, next) {

  // this function is called only if the authenticatuion was successful
  //req.user contains the authenticated user
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


//  GET /api/meme/captions: Retrieves seven possible captions for a given meme picture.
app.get('/api/meme/:memeId/captions', async (req, res) => {
  const memeId = req.params.memeId;
  try {
    const captions = await getCaptionsByMemeId(memeId);
    res.status(200).json({ captions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve Captions' });
  }
});



// POST /api/game/start:  Starts a new game for the authenticated user.
// *Protected API
app.post('/api/game/start', isLoggedIn, async (req, res) => {
  try {
    // Create a new game for the authenticated user
    const gameId = await createGame(req.user.id);

    // Fetch a random meme
    const meme = await getRandomMeme();
    if (!meme) {
      return res.status(500).json({ message: 'Failed to retrieve a meme' });
    }

    // Fetch captions for the meme
    const captions = await getCaptionsByMemeId(meme.id);
    if (!captions) {
      return res.status(500).json({ message: 'Failed to retrieve captions' });
    }

    // Prepare the response
    const response = {
      gameId: gameId,
      meme: {
        id: meme.id,
        url: meme.url,
      },
      captions: captions.map(caption => ({
        id: caption.id,
        text: caption.caption,
      })),
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error('Error starting a new game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// GET /api/users/profile: Get games and rounds for a user ID
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






app.post('/api/submitGameResults', async (req, res) => {
  const gameData = req.body;
  try {
    await saveGameResults(gameData);
    res.status(200).send('Game results saved successfully');
  } catch (err) {
    res.status(500).send('Error saving game results: ' + err.message);
  }
});

// start the server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });