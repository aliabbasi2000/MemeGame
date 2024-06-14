// server/dao/MemeDao.mjs

import { db } from '../db.mjs';

// Function to get a random meme
const getRandomMeme = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM memes ORDER BY RANDOM() LIMIT 1';
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
};

// Export the methods
export { getRandomMeme };
