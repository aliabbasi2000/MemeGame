import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GameSummary from './GameSummary';

const TOTAL_ROUNDS = 3;
const ROUND_TIME = 30;

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
  //ensuring that memes are Unique in each game
  const [usedMemes, setUsedMemes] = useState(new Set());
  //list of correctly selected captions for displaying in the GameSummary
  const [correctAnswers, setCorrectAnswers] = useState([]);

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
      let meme;
      let fetchedCaptions;
  
      //ensuring that memes are Unique in each game
      do {
        meme = await API.getRandomMeme();
      } while (usedMemes.has(meme.id));
  
      const updatedUsedMemes = new Set(usedMemes);
      updatedUsedMemes.add(meme.id);
      setUsedMemes(updatedUsedMemes);
  
      fetchedCaptions = await API.getCaptionsByMemeId(meme.id);
  
      const enhancedCaptions = fetchedCaptions.map((caption, index) => ({
        ...caption,
        correct: index < 2,
        memeId: meme.id,
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
      setAlertMessage('Bravo, You Earned 5 Points!!!');
      setAlertVariant('success');
      setCorrectAnswers((prevCorrectAnswers) => [
        ...prevCorrectAnswers,
        { meme, caption }
      ]);
    } else {
      setAlertMessage('Opss, Wrong!!!');
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

  console.log(gameData)

  const nextRound = () => {
    // insuring if the user does not click on the submit button we fetch the API and save the results
    // before fetching the API insuring the gamedata is not empty by: (totalScore != 0) -> empty game data causes error in dao
    if ((round === TOTAL_ROUNDS - 1)&&(gameData.length > 0)) {
      console.log("I am trying to submit")
      submitGameData()
      return(
        <>
        <GameSummary totalScore={totalScore} alertVariant={alertVariant} alertMessage={alertMessage} correctAnswers={correctAnswers}></GameSummary>
        </>
      )
    }
    else {
    console.log("I am not trying to submit")
    setHasSelected(false);
    setSelectedCaptionId(null);
    setCaptionCorrectness({});
    setAlertMessage('');
    setAlertVariant('');
    setRound((prevRound) => prevRound + 1);
    }
  };



  const submitGameData = async () => {
    setIsSubmitting(true);
    try {
      await API.submitGameResults(gameData);
      setAlertMessage('Game results submitted successfully!');
      setAlertVariant('success');
      setSubmissionSuccess(true);
      return(
        <>
        <GameSummary totalScore={totalScore} alertVariant={alertVariant} alertMessage={alertMessage} correctAnswers={correctAnswers}></GameSummary>
        </>
      )
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

  const restartGame = () => {
    window.location.reload();
  };

  if (gameOver) {
    return(
      <Container className="d-flex flex-column align-items-center justify-content-start mt-5">
      <h3 className="text-muted mb-4">You Didn't Play Any of Rounds, Bummer!</h3>
      <Button onClick={() => restartGame()}>Play Again</Button>
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
          {!isSubmitting && <Card>
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
                              ? 'rgb(0, 200, 0)'
                              : 'rgb(150, 0, 0)'
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
                    gameData.length > 0 && (
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
          </Card>}
          <>
          {isSubmitting && <GameSummary totalScore={totalScore} alertVariant={alertVariant} alertMessage={alertMessage} correctAnswers={correctAnswers}/>}
          </>
        </Col>
      </Row>
    </Container>
  );
}

export default Game;
