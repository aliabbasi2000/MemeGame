import { db } from '../db.mjs';


// Function to get a random meme from db
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


// Function to get 7 captions for a meme: First 2 captions are the correct captions / other 5 captions are randomly generated
const getCaptionsByMemeId = (memeId) => {
  return new Promise((resolve, reject) => {
    const bestCaptionsQuery = `
      SELECT c.id, c.caption
      FROM captions c
      JOIN meme_caption ON c.id = meme_caption.caption_id
      WHERE meme_caption.meme_id = ?
      ORDER BY RANDOM()
      LIMIT 2;
    `;

    db.all(bestCaptionsQuery, [memeId], (err, bestCaptions) => {
      if (err) {
        console.error('Error executing bestCaptionsQuery:', err);
        reject(err);
        return;
      }

      const otherCaptionsQuery = `
        SELECT c.id, c.caption
        FROM captions c
        WHERE c.id NOT IN (SELECT caption_id FROM meme_caption WHERE meme_id = ?)
        ORDER BY RANDOM()
        LIMIT 5;
      `;

      db.all(otherCaptionsQuery, [memeId], (err, otherCaptions) => {
        if (err) {
          console.error('Error executing otherCaptionsQuery:', err);
          reject(err);
        } else {

          const result = [...bestCaptions, ...otherCaptions]

          // !!! Dont need to validate the answers on server side. we send unsuffelled list to client so client can recognize the correct captions
          /*
          // for suffling the list of captions
          for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
          }
          */

          resolve(result);
        }
      });
    });
  });
};



export { getRandomMeme, getCaptionsByMemeId };
