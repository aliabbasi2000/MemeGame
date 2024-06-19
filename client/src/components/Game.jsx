import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import API from '../API.mjs';
import Captions from './Captions.jsx';

function Game() {
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const data = await API.startNewGame();
        setGameData(data);
        setError(null);
      } catch (err) {
        setError('Failed to start a new game. Error: ' + err);
      }
    };

    initializeGame();
  }, []);

  return (
    <Container className="mt-5">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {gameData && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Card>
              <Card.Img
                variant="top"
                src={gameData.meme.url}
                alt="Meme"
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px' }}
              />
              <Card.Body className="text-center">
                <Card.Title>Choose 2 of the best match Captions for the Meme:</Card.Title>
                <Captions memeId={gameData.meme.id} />
                <ul>
                  {gameData.captions.map(caption => (
                    <li key={caption.id}>{caption.capyion}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Game;
