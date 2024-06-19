import React, { useState, useEffect } from 'react';;
import { Container, Button, Row, Col, Card } from 'react-bootstrap'; 
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

  // meme object (id, url)
  //console.log(meme)

  if (!meme) return <div>Loading...</div>;

  return (
    
    <Container className="mt-5">
    {meme && (
      <Row className="justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Img
            variant="top"
            src={meme.url}
            alt="Meme"
            className="img-fluid mx-auto d-block"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px' }}
          />
          
        <Card.Body className="text-center">
          <Card.Title>Choose 2 of the best match Captions for the Meme:</Card.Title>
          <Captions memeId={meme.id}></Captions>
        </Card.Body>
      </Card>
      </Col>
      </Row>
    )}
  </Container>


  );
}

/*

     <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <img src={meme.url} alt="Random Meme" />
      <div>
        <ul>
        <Captions memeId={2}></Captions>
        </ul>
      </div>
    </Container>

*/


export default MemeGame;