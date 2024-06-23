import { Container, Button, Alert} from 'react-bootstrap';
function GameOver({totalScore, alertVariant, alertMessage}){

    const restartGame = () => {
        window.location.reload(); // Reload the page
      };


    return (
        <Container className="text-center">
          <h3>Game Over! Thanks for playing!</h3>
          <Alert variant={alertVariant}>
            {alertMessage}
          </Alert>
          <h4>Your Total Score: {totalScore}</h4>
          <Button className="ml-2"  onClick={() => restartGame() }>Play Again</Button>
        </Container>
      );


}

export default GameOver;