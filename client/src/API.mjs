//import {Question, Answer} from './QAModels.mjs';

const SERVER_URL = 'http://localhost:3001';

// logIn
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

// getUserInfo
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

// Logout
const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}



// Get a random meme
const getRandomMeme = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/meme');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching meme:', error);
    throw error;
  }
};


// get captions by memeId
const getCaptionsByMemeId = async (memeId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/meme/${memeId}/captions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.captions;
  } catch (error) {
    console.error('Error fetching captions:', error);
    throw error;
  }
};

const API = { logIn, logOut, getUserInfo, getRandomMeme, getCaptionsByMemeId };
export default API;