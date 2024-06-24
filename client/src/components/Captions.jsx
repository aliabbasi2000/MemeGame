

import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Button, Row, Col, Card, Alert  } from 'react-bootstrap';


function Captions(props) {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // for handling the correct captions in the list of all captions
  const [selectedCaptionId, setSelectedCaptionId] = useState(null);
  const [captionCorrectness, setCaptionCorrectness] = useState({});
  // for showing the selection results for the user
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  // for enssuring that user can select only one caption
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        const fetchedCaptions = await API.getCaptionsByMemeId(props.memeId);
        const enhancedCaptions = fetchedCaptions.map((caption, index) => ({
          ...caption,
          correct: index < 2
        }));
        const shuffledCaptions = shuffleArray(enhancedCaptions);
        setCaptions(shuffledCaptions);
      } catch (err) {
        setError('Failed to fetch captions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptions();
  }, [props.memeId]);

  const shuffleArray = (array) => {
    const shuffled = array.slice(); // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCaptionClick = (caption) => {
    const isCorrect = caption.correct;
    setSelectedCaptionId(caption.id);
    setCaptionCorrectness(prevState => ({
      ...prevState,
      [caption.id]: isCorrect
    }));
    setHasSelected(true);

    if (isCorrect) {
      setAlertMessage('Bravo!!! You are Eligible for Becoming a Memer. Just Login and become a Sigma');
      setAlertVariant('success');
    } else {
      setAlertMessage('Wrong!!! Even don\'t try to login. Press that red buttun on your browser and Exit');
      setAlertVariant('danger');
    }
  };


  const restartGame = () => {
    window.location.reload(); // Reload the page
  };


  if (loading) {
    return <div>Loading captions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // list of 7 caption objects (id, caption)
  // first 2 caption objects are the correct caption, the rest 5 are the wrong
  console.log(captions);



  return  (
<div className="d-flex flex-column">
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}
      {captions.map(caption => (
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
                  ? 'rgb(0, 200, 0)'
                  : 'rgb(150, 0, 0)'
                : hasSelected && caption.correct
                ? 'yellow'
                : ''
          }}
        >
          {caption.caption}
        </Button>
        
      ))}

      <Card>
      {hasSelected && <Button onClick={() => restartGame()}> Restart </Button>}
      </Card>

    </div>

  );


};



export default Captions;