import React, { useState, useEffect, useRef } from 'react';;
import { Container, Button, Row, Col, Card } from 'react-bootstrap'; 
import API from '../API.mjs';
import Captions from './Captions.jsx';


function MemeGame() {
  const [meme, setMeme] = useState(null);

  // useRef to Ensure the fetch is only called once, if the ref indicates it hasn't been called before.
  // without it fetching happens 2 times at the beggining and makes problems sometimes.
  const fetchInitiated = useRef(false); 

  useEffect(() => {
    if (fetchInitiated.current) return; // Return if fetch has already been initiated
    
    async function fetchMeme() {
      try {
        const memeData = await API.getRandomMeme();
        setMeme(memeData);
      } catch (error) {
        console.error('Error fetching meme:', error);
      }
    }
    fetchMeme();
    fetchInitiated.current = true; // Set fetch initiation flag to true
  }, []);

  // meme object (id, url)
  console.log(meme)


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
            style={{ maxWidth: '80%', maxHeight: '80%' }}
          />
          
        <Card.Body className="text-center">
          <Card.Title>Verify your Meme taste!</Card.Title>
          <Captions memeId={meme.id}></Captions>
        </Card.Body>
      </Card>
      

      </Col>

      </Row>
    )}
  </Container>


  );
}



export default MemeGame;