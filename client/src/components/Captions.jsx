

import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Button, Row, Col } from 'react-bootstrap';


function Captions(props) {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        const fetchedCaptions = await API.getCaptionsByMemeId(props.memeId);
        setCaptions(fetchedCaptions);
      } catch (err) {
        setError('Failed to fetch captions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptions();
  }, [props.memeId]);
  
  const handleCaptionClick = (caption) => {
    alert(`You selected: ${caption.caption}`);
  };

  if (loading) {
    return <div>Loading captions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  
  console.log(captions);

  return  (
    <Container className="text-center">
      <h3>Captions for Meme {props.memeId}</h3>
      {captions.map(caption => (
        <Row key={caption.id} className="justify-content-center my-2">
          <Col xs="auto">
            <Button
              onClick={() => handleCaptionClick(caption)}
              style={{ width: '1000px', height: '40px', backgroundColor: 'white', color: 'black', border: '1px solid black' }}
              
            >
              {caption.caption}
            </Button>
          </Col>
        </Row>
      ))}
    </Container>
  );
};


export default Captions;