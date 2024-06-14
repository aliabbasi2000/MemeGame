// imports
import express from 'express';

// init express
const app = new express();
const port = 3001;

// Serve the URL paths to the images.
const cors = require('cors');
const db = require('./db');

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});