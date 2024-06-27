import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import NavHeader from "./components/NavHeader";
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import API from './API.mjs';
import MemeGame from './components/MemeGame';
import Game from "./components/Game";
import Profile from './components/Profile';
import Footer from './components/Footer';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // welcome msg to the logged in user
  const [message, setMessage] = useState(''); 
  const [user, setUser] = useState(''); 
  const navigate = useNavigate();


  // check the authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); 
      setLoggedIn(true);
      setUser(user);
    };
    if (loggedIn) {
      checkAuth();
    }
    //Change dependency array to check the authentication whenever loggedin state changes.
  }, [loggedIn]);
  

  // Login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.username}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  // Logout
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  const startDemoGame = () => {
    navigate('/demogame');
  };

  const startGame = () => {
    navigate('/game');
  };

  //console.log(user)

  return (

    <div className="App">
      <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
      <Container fluid className='mt-3'>

      {/* Conditional Rendering: If message is truthy(not null, undefined, false,), it will render the content.*/}
      {message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> }
  
    <Routes>
      <Route path="/" element={
        <Container className='d-flex flex-column justify-content-start align-items-center vh-100'>
          <Row className='justify-content-center mt-5'>
            <Col className='text-center'>
            
            {/* Home Page for Anonymos user */}
            {!loggedIn && <h1  className="h2">What Do You Meme? </h1>}
            {!loggedIn && <p> Get ready to test your creativity and humor!! <br/> Click the Button below </p>}
            {!loggedIn && <Button variant="primary" onClick={startDemoGame} className='mt-3'>Start demo Game</Button>}

            {/* Home Page for Authenticatef user */}
            {loggedIn && <h1  className="h3">Welcome to the Meme Game! </h1>}
            {loggedIn && <p>Click the button below to start the Real Game!</p>}
            {loggedIn && <Button variant="primary" onClick={startGame} className='mt-3'>Let the Memes Begin</Button>}
            
            </Col>
          </Row>
        </Container>
      } />

      <Route path="/demogame" element={<MemeGame />} />

      {/* If loggedIn is false, redirect to home page; otherwise, render the Game component. */} 
      {/* For the case that user clicks on log out during the game */}
      <Route path='/game' element={
        !loggedIn ? <Navigate replace to='/' /> : <Game user={user} loggedIn={loggedIn}/>
      } />
      <Route path="*" element={ <NotFound/> } />

      {/* If loggedIn is true, redirect to home page; otherwise, render the LoginForm component. */}
      <Route path='/login' element={
        loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
      } />

      {/* If loggedIn is true, render the Profile component; otherwise, redirect to home page. */}
      <Route path='/profile' element={loggedIn ? <Profile user={user}/> : <Navigate to='/' />} />

      
    </Routes>
    </Container>
    <Footer />
    </div>

  )
}

export default App
