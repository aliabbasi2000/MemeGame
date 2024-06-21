import React from 'react';
import { useParams } from 'react-router-dom';

function Profile(props) {
//   let { username } = useParams(); // Assuming username is passed as a parameter

  return (
    <div>
      <h2>Profile Page</h2>
      <h2>username: {props.user.username}</h2>

      {/* <p>Welcome, {username}!</p> */}
    </div>
  );
}

export default Profile;