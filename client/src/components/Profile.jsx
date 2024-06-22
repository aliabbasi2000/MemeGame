import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap'; 
import API from '../API.mjs';
import { useEffect, useState } from 'react';

function Profile(props) {

    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProfileData = async () => {
          try {
            const data = await API.getUserProfile(props.user.id);
            setProfileData(data);
          } catch (error) {
            setError(error);
            console.error('Error fetching profile:', error);
          }
        };
    
        fetchProfileData();
    }, [props.user.id]);
    
    if (error) {
        return <div>Error: {error}</div>;
      }
    
    if (!profileData) {
        return <div>Loading...</div>;
      }

    const calculateTotalScore = (games) => {
    return games.reduce((acc, game) => {
        const gameTotal = game.rounds.reduce((roundAcc, round) => roundAcc + round.score, 0);
        return acc + gameTotal;
    }, 0);
    };

    const totalScore = calculateTotalScore(profileData.games);
    

    return (
        <Container className="my-5">
            <Row className="justify-content-center mb-4">
                <Col md={8} className="text-center">
                    <h1 className="display-4">Profile Page</h1>
                    <h4 className="text-muted">Username: {props.user.username}</h4>
                    <h5 className="text-info">Total Score: {totalScore}</h5>
                </Col>
            </Row>
            {profileData.games.map((game) => {
                const gameTotalScore = game.rounds.reduce((acc, round) => acc + round.score, 0);
                return (
                    <Card key={game.game_id} className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-primary">Game ID: {game.game_id}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Game Score: {gameTotalScore}</Card.Subtitle>
                            <Row>
                                {game.rounds.map((round) => (
                                    <Col md={4} key={round.round_id} className="mb-3">
                                        <Card className="h-100">
                                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                                <Card.Img 
                                                    src={round.meme_url} 
                                                    alt="Meme" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                            </div>
                                            <Card.Body>
                                                {/* <Card.Text><strong>Selected Caption ID:</strong> {round.selected_caption_id}</Card.Text> */}
                                                <Card.Text><strong>Score:</strong> {round.score}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                );
            })}
        </Container>
    );
}
    
export default Profile;