import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GameOver from './GameOver';

const TOTAL_ROUNDS = 3;
const ROUND_TIME = 4;

function Game(props) {
  const [round, setRound] = useState(0);
  const [meme, setMeme] = useState({});
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
  const [gameData, setGameData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

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
        memeId: meme.id, // Add memeId here
      }));
      const shuffledCaptions = shuffleArray(enhancedCaptions);
      setMeme(meme);
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


  //insuring that runs in strick mode
  //useEffect(() => {console.log("TEST STRICKT MODE")}, []);


  const handleCaptionClick = (caption) => {
    const isCorrect = caption.correct;
    setSelectedCaptionId(caption.id);
    setCaptionCorrectness((prevState) => ({
      ...prevState,
      [caption.id]: isCorrect,
    }));
    setHasSelected(true);

    if (isCorrect) {
      setAlertMessage('Bravo!!!');
      setAlertVariant('success');
    } else {
      setAlertMessage('Wrong!!!');
      setAlertVariant('danger');
    }

    const roundData = {
      userId: props.user.id,
      round: round + 1,
      meme_id: caption.memeId,
      selected_caption_id: caption.id,
      score: isCorrect ? 5 : 0,
    };

    setGameData((prevGameData) => [...prevGameData, roundData]);
    setTotalScore((prevTotalScore) => prevTotalScore + roundData.score);
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
    setGameData([]);
    setSubmissionSuccess(false);
    setIsSubmitting(false);
  };

  const submitGameData = async () => {
    setIsSubmitting(true);
    try {
      await API.submitGameResults(gameData);
      setAlertMessage('Game results submitted successfully!');
      setAlertVariant('success');
      setSubmissionSuccess(true);
    } catch (err) {
      console.error('Failed to submit game results:', err);
      setAlertMessage('Failed to submit game results.');
      setAlertVariant('danger');
      setIsSubmitting(false);
    }
  };

  const percentage = (timer / ROUND_TIME) * 100;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (gameOver) {
    return(
      <Container>
      <GameOver totalScore={totalScore} alertVariant={alertVariant} alertMessage={alertMessage}></GameOver>
      </Container>
    )
  }

  //console.log(gameData)
  
  return (
    <Container className="mt-5">
      {!isSubmitting && <Col>
        <h2 className="text-muted">Round {round+1} of 3 </h2>
        <div style={{ width: 230, height: 0 }}>
          <CircularProgressbar
            value={percentage}
            text={`${timer}s`}
            styles={buildStyles({
              textColor: '#000',
              pathColor: '#08e',
              trailColor: '#ddd',
            })}
          />
        </div>
      </Col>}
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
              <Card.Title>"Memeify" the captions below!</Card.Title>
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
                            : hasSelected && caption.correct
                              ? 'yellow'
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
                {round === TOTAL_ROUNDS - 1 ? (
                  submissionSuccess ? null : (
                    totalScore > 0 && (
                      <Button onClick={submitGameData} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    )
                  )
                ) : (
                  <Button onClick={nextRound}>Next Round</Button>
                )}
              </Row>
            )}
            </Card.Body>
          </Card>
          <>
          {isSubmitting && <GameOver totalScore={totalScore} alertVariant={alertVariant} alertMessage={alertMessage} />}
          </>
        </Col>
      </Row>
    </Container>
  );
}

export default Game;
