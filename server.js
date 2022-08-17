// Dependencies
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Variables
const PORT = 3001;
const app = express();
let db = require('./db/db.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Handle API GET calls
app.get('/api/notes', (req, res) => 
    res.json(db)
);

app.get('/api/notes/:note_id', (req, res) => {
    for(let i = 0; i < notes.length; i++){
        const currentNote = notes[i];
        if(currentNote.note_id === req.params.note_id) {
        res.status(200).json({currentNote});
        }
        return;
    }
})

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

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            console.log(data);
            if(err){
                console.error(err);
            } else {
                const existingNotes = JSON.parse(data);

                existingNotes.push(newNote);

                fs.writeFile('./db/db.json',JSON.stringify(existingNotes, null, 4),
                (writeErr) =>
                writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
              );
            }
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