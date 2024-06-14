import React, { useState, useEffect } from 'react';
import { getRandomMeme } from '../API.mjs';
import { Container } from 'react-bootstrap'; 

function MemeGame() {
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    async function fetchMeme() {
      try {
        const memeData = await getRandomMeme();
        setMeme(memeData);
      } catch (error) {
        console.error('Error fetching meme:', error);
      }
    }
    fetchMeme();
  }, []);

  if (!meme) return <div>Loading...</div>;

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <img src={meme.url} alt="Random Meme" />
    </Container >
  );
}

export default MemeGame;