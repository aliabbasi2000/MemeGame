import React, { useState, useEffect } from 'react';;
import { Container } from 'react-bootstrap'; 
import API from '../API.mjs';
import Captions from './Captions.jsx';

function MemeGame() {
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    async function fetchMeme() {
      try {
        const memeData = await API.getRandomMeme();
        setMeme(memeData);
      } catch (error) {
        console.error('Error fetching meme:', error);
      }
    }
    fetchMeme();
  }, []);

  if (!meme) return <div>Loading...</div>;

  return (

     <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <img src={meme.url} alt="Random Meme" />
      <div>
        <ul>
        <Captions memeId={2}></Captions>
        </ul>
      </div>
    </Container>
  );
}

export default MemeGame;