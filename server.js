// Dependencies
const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

// Variables
const PORT = 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use('/api', api);
app.use(express.static('public'));

// Get Route for Landing Page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Get Route for the Notes Page
app.get('/notes', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Launch the server 
app.listen(PORT, ()=>
    console.log(`SuperNoteTaker listening at http://localhost:${PORT}`)
);