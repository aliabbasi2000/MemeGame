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


// ????????????????????????????????????????????????????????????????.....
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
    //console.log('Executing SQL query with userId:', userId); // Debug log
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        //console.error('SQL query error:', err); // Error log
        reject(err);
      } else {
        console.log('SQL query returned rows:', rows); // Debug log
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
        const result = Object.values(games); // Convert object to array of games
        //console.log('Structured games data:', result); // Log the result
        resolve(result);
      }
    });
  });
};



// Save game results to the database
const saveGameResults = async (gameData) => {
  return new Promise((resolve, reject) => {
    const insertGameSQL = 'INSERT INTO games (user_id) VALUES (?)';
    const insertRoundSQL = 'INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)';

    console.log('gameData in DAO:', gameData);

    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(err);
          return;
        }

        let rollback = false;

        db.run(insertGameSQL, [gameData[0].userId], function(err) {
          if (err) {
            db.run('ROLLBACK', (rollbackErr) => {
              return rollbackErr ? reject(rollbackErr) : reject(err);
            });
            return;
          }

          const gameId = this.lastID;

          gameData.forEach((round) => {
            db.run(insertRoundSQL, [gameId, round.meme_id, round.selected_caption_id, round.score], (err) => {
              if (err) {
                rollback = true;
                db.run('ROLLBACK', (rollbackErr) => {
                  if (rollbackErr) {
                    reject(rollbackErr);
                  } else {
                    reject(err);
                  }
                });
                return;
              }
            });
          });

          if (!rollback) {
            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                reject(commitErr);
              } else {
                resolve();
              }
            });
          }
        });
      });
    });
  });
};







export { createGame, getGameById, getGamesByUserId, saveGameResults };



/*





const saveGameResults = async (gameData) => {
  return new Promise((resolve, reject) => {
    
    const insertRoundQuery = 'INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)';

    console.log('gameData in DAO:', gameData);
    
    if (!Array.isArray(gameData)) {
      return reject(new Error('Invalid gameData structure'));
    }

    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(err);
          return;
        }

        let rollback = false;

        gameData.forEach((round) => {
          db.run(insertRoundQuery, [round.gameId, round.meme_id, round.selected_caption_id, round.score], (err) => {
            if (err) {
              rollback = true;
              db.run('ROLLBACK', (rollbackErr) => {
                if (rollbackErr) {
                  reject(rollbackErr);
                } else {
                  reject(err);
                }
              });
              return;
            }
          });
        });

        if (!rollback) {
          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              reject(commitErr);
            } else {
              resolve();
            }
          });
        }
      });
    });
  });
};

*/