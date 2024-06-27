import { Container, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
function GameSummary({totalScore, alertVariant, alertMessage, correctAnswers }){
  const navigate = useNavigate();

  const restartGame = () => {
      navigate('/');
    };

  return (
      <Container className="text-center">
        <h3>Game Over! Thanks for playing!</h3>
        <Alert variant={alertVariant}>
          {alertMessage}
        </Alert>
        <h4>Your Total Score: {totalScore}</h4>
        {correctAnswers.length > 0 && (
          <>
            <h5>Correctly Answered Captions:</h5>
            <Row className="justify-content-center">
              {correctAnswers.map(({ meme, caption }) => (
                <Col key={caption.id} md={4} className="my-2">
                  <Card>
                    <Card.Img variant="top" src={meme.url} />
                    <Card.Body>
                      <Card.Text>{caption.caption}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
        <Button className="ml-2" onClick={() => restartGame()}>Play Again</Button>
      </Container>
    );
  }    


export default GameSummary;