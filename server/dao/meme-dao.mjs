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


/*
// TEST
const getCaptionsByMemeId = (memeId) => {
  return new Promise((resolve, reject) => {
    const bestMatchQuery = `
      SELECT captions.id, captions.caption
      FROM captions
      WHERE captions.id = ?
      `;
      this.db.all(bestMatchQuery, [memeId], (err, bestMatchRows) => {
        if (err) {
          reject(err);
          return;
        }
  
  

          resolve(bestMatchRows);
        });
      });
    };



*/

// SELECT c.id, c.caption
// FROM captions c
// JOIN meme_caption ON c.id = meme_caption.caption_id
// WHERE meme_caption.meme_id = ?
// ORDER BY RANDOM()
// LIMIT 2;


const getCaptionsByMemeId = async (memeId) => {
  try {
    const bestCaptionsQuery = `
      SELECT c.id, c.caption
        FROM captions c
        JOIN meme_caption ON c.id = meme_caption.caption_id
        WHERE meme_caption.meme_id = ?
        ORDER BY RANDOM()
        LIMIT 2;
    `;

    const bestCaptions = await db.all(bestCaptionsQuery, [memeId]);

    const otherCaptionsQuery = `
      SELECT c.id, c.caption
      FROM captions c
      WHERE c.id NOT IN (SELECT caption_id FROM meme_caption WHERE meme_id = ?)
      ORDER BY RANDOM()
      LIMIT 5;
    `;

    const otherCaptions = await db.all(otherCaptionsQuery, [memeId]);
    return [...bestCaptions, ...otherCaptions];

    } catch (error) {
    console.error('Error while getting captions from database! :(  :', error);
    throw error;
  }
};


export { getRandomMeme, getCaptionsByMemeId };
