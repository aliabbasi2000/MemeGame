import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
import 'bootstrap-icons/font/bootstrap-icons.css';


function NavHeader (props) {
  return(
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container fluid>
        <Link to='/' className='navbar-brand'>Meme Game</Link>

        {props.loggedIn ? 
            <React.Fragment>
            {/* Profile icon */}
            <Link to='/profile' className='nav-link link-light text-decoration-none'>
              <i className='bi bi-person-circle'></i>
            </Link>
            {/* Logout button */}
            <LogoutButton logout={props.handleLogout} />
          </React.Fragment>
          :
          <Link to='/login' className='btn btn-outline-light'>Login</Link>
        }

      </Container>
    </Navbar>
  );
}

export default NavHeader;
