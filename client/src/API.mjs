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



//  Start a new game for the authenticated user.
const startNewGame = async () => {
  try {
    const response = await fetch('/api/game/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (err) {
    console.error('Error starting a new game:', err);
    throw err;
  }
};



const getUserProfile = async (userId) => {
  const response = await fetch(`${SERVER_URL}/api/users/profile?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if(response.ok) {
    const profileData = await response.json();
    return profileData;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};




export const submitGameResults = async (gameData) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/submitGameResults`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameData)
    });
    if (!response.ok) {
      throw new Error('Failed to save game results');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};


const API = { logIn, logOut, getUserInfo, getRandomMeme, getCaptionsByMemeId, startNewGame, getUserProfile, submitGameResults };
export default API;


