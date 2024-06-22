import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Button, Alert, Card } from 'react-bootstrap';
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
    <Container className="text-center">
      <h3>Round {round + 1} of {TOTAL_ROUNDS}</h3>
      <div className="d-flex justify-content-center my-4">
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
      </div>
      <div>
        <img src={memeUrl} alt="Meme" style={{ maxWidth: '100%' }} />
      </div>
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}
      {captions.map((caption) => (
        <Button
          key={caption.id}
          variant="outline-primary"
          className="my-2"
          onClick={() => handleCaptionClick(caption)}
          disabled={hasSelected}
          style={{
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
      ))}
      <Card>
        {hasSelected && <Button onClick={nextRound}>Next Round</Button>}
      </Card>
    </Container>
  );
}

export default Game;
