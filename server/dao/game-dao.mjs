import { db } from '../db.mjs';

// Get games and rounds for a user ID by (Joining the games table with rounds & memes)
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



// Save game Data to the games and rounds table
const saveGameResults = async (gameData) => {
  return new Promise((resolve, reject) => {
    const insertGameSQL = 'INSERT INTO games (user_id) VALUES (?)';
    const insertRoundSQL = 'INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)';

    //console.log('gameData in DAO:', gameData); //Logging

    // Start a serialized database transaction and Begin a transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Set the rollback flag to false initially.
        let rollback = false;

        // Insert Game Record into games table
        // Picking the userID from the first object of the gamedata list(gameData[0]). doesn't work matter which object, all of them has same user id.
        // If there is an error inserting Game Record -> perform a rollback(by setting the rollback flag to true) and rejects the promise.
        db.run(insertGameSQL, [gameData[0].userId], function(err) {
          if (err) {
            db.run('ROLLBACK', (rollbackErr) => {
              return rollbackErr ? reject(rollbackErr) : reject(err);
            });
            return;
          }

          // Insert Round Record into rounds table
          // If there is an error inserting the Round record -> perform a rollback(by setting the rollback flag to true) and rejects the promise.
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


          //If no errors occurred (rollback is false) -> commit the transaction with COMMIT
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



export { getGamesByUserId, saveGameResults };
