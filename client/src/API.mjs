const SERVER_URL = 'http://localhost:3001';

// fethc logIn API
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // include credentials to ensure that session cookies are included in the request.
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


// Get the Info of Authenticated user
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


// Preform Logout
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


// Get seven possible captions for a given meme ID.
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


// Get Profile of user consist of games and rounds
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



// Save game results on the server
export const submitGameResults = async (gameData) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/submitGameResults`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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


const API = { logIn, logOut, getUserInfo, getRandomMeme, getCaptionsByMemeId, getUserProfile, submitGameResults };
export default API;


