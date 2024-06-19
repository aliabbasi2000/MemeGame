

import React, { useEffect, useState } from 'react';
import API from '../API.mjs';


function Captions(props) {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        const fetchedCaptions = await API.getCaptionsByMemeId(props.memeId);
        setCaptions(fetchedCaptions);
      } catch (err) {
        setError('Failed to fetch captions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptions();
  }, [props.memeId]);

  if (loading) {
    return <div>Loading captions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  
  console.log(captions);

  return (
    <div>
      <h3>Captions for Meme {props.memeId}</h3>
      <ul>
        {captions.map(captions => (
          <li key={captions.id}>{captions.caption}</li>
        ))}
      </ul>
    </div>
  );
};


export default Captions;