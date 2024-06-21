import { db } from '../db.mjs';

// Create a new game
const createGame = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO games (user_id) VALUES ?';
    db.run(sql, [userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // Return the ID of the newly inserted game
      }
    });
  });
};

// Get a game by ID
const getGameById = async (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ?';
    db.get(sql, [gameId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};



// Get games and rounds for a user ID
const getGamesByUserId = async (userId) => {
  const sql = `
    SELECT games.id AS game_id, rounds.id AS round_id, rounds.selected_caption_id, rounds.score, memes.url
    FROM games
    INNER JOIN rounds ON games.id = rounds.game_id
    INNER JOIN memes ON rounds.meme_id = memes.id
    WHERE games.user_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Organize data into a structured format
        const games = {};
        rows.forEach(row => {
          if (!games[row.game_id]) {
            games[row.game_id] = {
              game_id: row.game_id,
              rounds: []
            };
          }
          games[row.game_id].rounds.push({
            round_id: row.round_id,
            selected_caption_id: row.selected_caption_id,
            score: row.score,
            meme_url: row.url
          });
        });
        resolve(Object.values(games)); // Convert object to array of games
      }
    });
  });
};


export { createGame, getGameById, getGamesByUserId };
