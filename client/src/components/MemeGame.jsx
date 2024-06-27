import React, { useState, useEffect } from 'react';;
import { Container, Button, Row, Col, Card } from 'react-bootstrap'; 
import API from '../API.mjs';
import Captions from './Captions.jsx';


function MemeGame() {
  const [meme, setMeme] = useState(null);

  // Ensure the fetching is only happens once.
  // without it fetching happens 2 times at the beggining and makes problems sometimes.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted
    
    async function fetchMeme() {
      try {
        const memeData = await API.getRandomMeme();
        if (isMounted) { // Check if component is still mounted before updating state
          setMeme(memeData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching meme:', error);
        setLoading(false)
      }
    }

    if (meme === null) { // Fetch meme only if it hasn't been fetched yet
      fetchMeme();
    }
    return () => {
      isMounted = false; // Clean up by setting isMounted to false when unmounting
    };
  }, [meme]); // ensure useEffect runs once on mount

  // meme object (id, url)
  //console.log(meme)


  if (loading) return <div>Loading...</div>;



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