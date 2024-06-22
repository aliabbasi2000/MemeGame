import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TOTAL_ROUNDS = 3;
const ROUND_TIME = 30; // 30 seconds for each round

function Game() {
  const [round, setRound] = useState(0);
  const [memeUrl, setMemeUrl] = useState('');
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCaptionId, setSelectedCaptionId] = useState(null);
  const [captionCorrectness, setCaptionCorrectness] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(ROUND_TIME);

  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchMemeAndCaptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const meme = await API.getRandomMeme();
      const fetchedCaptions = await API.getCaptionsByMemeId(meme.id);
      const enhancedCaptions = fetchedCaptions.map((caption, index) => ({
        ...caption,
        correct: index < 2,
      }));
      const shuffledCaptions = shuffleArray(enhancedCaptions);
      setMemeUrl(meme.url);
      setCaptions(shuffledCaptions);
    } catch (err) {
      setError('Failed to fetch meme or captions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      fetchMemeAndCaptions();
      setTimer(ROUND_TIME); // Reset timer for new round
    } else {
      setGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    if (timer > 0 && !hasSelected) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      nextRound();
    }
  }, [timer, hasSelected]);

  const handleCaptionClick = (caption) => {
    const isCorrect = caption.correct;
    setSelectedCaptionId(caption.id);
    setCaptionCorrectness((prevState) => ({
      ...prevState,
      [caption.id]: isCorrect,
    }));
    setHasSelected(true);

    if (isCorrect) {
      setAlertMessage('Bravo!!! You are Eligible for Becoming a Memer. Just Login and become a Sigma');
      setAlertVariant('success');
    } else {
      setAlertMessage('Wrong!!! Even don\'t try to login. Press that red button on your browser and Exit');
      setAlertVariant('danger');
    }
  };

  const nextRound = () => {
    setHasSelected(false);
    setSelectedCaptionId(null);
    setCaptionCorrectness({});
    setAlertMessage('');
    setAlertVariant('');
    setRound((prevRound) => prevRound + 1);
  };

  const startGame = () => {
    setRound(0);
    setGameOver(false);
    setHasSelected(false);
    setSelectedCaptionId(null);
    setCaptionCorrectness({});
    setAlertMessage('');
    setAlertVariant('');
  };

  const percentage = (timer / ROUND_TIME) * 100;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (gameOver) {
    return (
      <Container className="text-center">
        <h3>Game Over! Thanks for playing!</h3>
        <Button onClick={startGame}>Play Again</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <div style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            value={percentage}
            text={`${timer}s`}
            styles={buildStyles({
              textColor: '#000',
              pathColor: '#f00',
              trailColor: '#ddd',
            })}
          />
        </div>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={memeUrl}
              alt="Meme"
              className="img-fluid mx-auto d-block"
              style={{ maxWidth: '80%', maxHeight: '80%' }}
            />
            <Card.Body className="text-center">
              <Card.Title>"Memeify" the captions below to verify your Meme taste!</Card.Title>
              {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                  {alertMessage}
                </Alert>
              )}
              {captions.map((caption) => (
                <Row key={caption.id} className="my-2">
                  <Col>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleCaptionClick(caption)}
                      disabled={hasSelected}
                      style={{
                        width: '100%',
                        backgroundColor:
                          selectedCaptionId === caption.id
                            ? captionCorrectness[caption.id]
                              ? 'green'
                              : 'red'
                            : '',
                      }}
                    >
                      {caption.caption}
                    </Button>
                  </Col>
                </Row>
              ))}
              {hasSelected && (
                <Row className="justify-content-center my-4">
                  <Button onClick={nextRound}>Next Round</Button>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Game;
