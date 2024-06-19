import { db } from '../db.mjs';

// Function to create a new game
const createGame = async (userId) => {
  return new Promise((resolve, reject) => {
    const status = 'ongoing';
    const sql = 'INSERT INTO games (userId, status) VALUES (?, ?)';
    db.run(sql, [userId, status], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // Return the ID of the newly inserted game
      }
    });
  });
};

// Function to fetch a game by ID
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

export { createGame, getGameById };
