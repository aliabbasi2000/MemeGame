import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import NavHeader from "./components/NavHeader";
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import API from './API.mjs';
import MemeGame from './components/MemeGame';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState(''); // NEW
  const [user, setUser] = useState(''); // NEW
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  // NEW
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

  // NEW
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  const startGame = () => {
    navigate('/game');
  };

  return (
    <Routes>
      <Route element={
        <>
        <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>

          {/* Conditional Rendering: If message is truthy(not null, undefined, false,), it will render the content.*/}
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }

          <Outlet/>
        </Container>
        </>
      }>

<Route path="/" element={
          <Container className='d-flex flex-column justify-content-start align-items-center vh-100'>
            <Row className='justify-content-center mt-5'>
              <Col className='text-center'>
                <h1  className="h3">Welcome to the MemeGame! developed by <a href="https://github.com/aliabbasi2000" target="_blank" rel="noopener noreferrer">Ali Abbasi</a></h1>
                <p>Click the button below to start demo playing</p>
                <Button variant="primary" onClick={startGame} className='mt-3'>Start Game</Button>
              </Col>
            </Row>
          </Container>
        } />
        <Route path="/game" element={<MemeGame />} />
        <Route path="*" element={ <NotFound/> } />
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />
      </Route>
    </Routes>

  )
}

export default App
