const notes = require('express').Router();

// Get Route for retrieving all the notes
notes.get('/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for adding a notes
notes.post('/notes', (req, res) => {
    console.log(res.json(JSON.parse(data)))
});

module.exports = notes;