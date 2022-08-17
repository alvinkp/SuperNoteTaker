// Dependencies
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const util = require('util');

// Variables
const PORT = process.env.PORT || 3001;
const app = express();
let db = require('./db/db.json');
const readUtility = util.promisify(fs.readFile);
const writeUtility = util.promisify(fs.writeFile);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Handle API GET calls
app.get('/api/notes', (req, res) => {
    readUtility('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Handle API POST calls
app.post('/api/notes', (req, res) => {
    console.log(req.body)
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readUtility('./db/db.json')
            .then((data) => {
                const existingNotes = JSON.parse(data);
                existingNotes.push(newNote);
                writeUtility('./db/db.json', JSON.stringify(existingNotes));
            });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);

    } else {
        res.status(500).json('Error in saving Note');
    }
});

// Handle Delete calls
app.delete('/api/notes/:note_id', (req, res) => {
    readUtility('./db/db.json')
        .then((data) => {
            let notes = JSON.parse(data);

            console.log(`DELETE REQUEST RECEIVED: ${req.params.note_id}`)
            for (let i = 0; i < notes.length; i++) {
                let currentNote = notes[i];
                if (currentNote.id === req.params.note_id) {
                    notes.splice(i, 1);
                    writeUtility('./db/db.json', JSON.stringify(notes))
                    return res.status(200).json(`${currentNote} was removed successfully!`);
                }
            }
            return res.status(500).json('Error in deleting Note');
        })
});


// Get Route for the Notes Page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// Get Route for the Landing Page
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Launch the server 
app.listen(PORT, () =>
    console.log(`SuperNoteTaker listening at http://localhost:${PORT}`),
);