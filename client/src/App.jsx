import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import NavHeader from "./components/NavHeader";
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import API from './API.mjs';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState(''); // NEW
  const [user, setUser] = useState(''); // NEW

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
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
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

  return (
    <Routes>
      <Route element={<>
        {/* UPDATED */}
        <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          {/* NEW */}
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Outlet/>
        </Container>
        </>
      }>
        
        <Route path="*" element={ <NotFound/> } />
        {/* NEW */}
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />
      </Route>
    </Routes>

  )
}

export default App
