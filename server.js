// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const notesObj = require('./db/db');
const dbJson = path.join(__dirname, './db/db.json');

// Sets up the Express App - for local usage port 5500 is in use
// Use https://localhost:5500 in a local web browser once running
const app = express();
const PORT = process.env.PORT || 3000;

// CSS & JS file access
app.use(express.static(__dirname + '/public'));

// Setup Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// GET api/notes from db.json
app.get('/api/notes', (req, res) => res.json(notesObj));

// POST api/note and add a note id to each note
app.post('/api/notes', (req, res) => {

    let addNote = req.body;
    let noteId = 0;

    for (let i = 0; i < notesObj.length; i++) {

        let note = notesObj[i];

        if (note.id > noteId) {
            noteId = note.id;
        }
    };

    addNote.id = noteId + 1;
    notesObj.push(addNote);
    fs.writeFile(dbJson, JSON.stringify(notesObj), error =>
        error ? console.log(error) : console.log('Note saved.'));
    res.json(addNote);
});

// DELETE api/note using matching id
app.delete('/api/notes/:id', (req, res) => {

    const lastId = req.params.id;

    for (let i = 0; i < notesObj.length; i++) {
        if (notesObj[i].id == lastId) {
            notesObj.splice(i, 1);
            break;
        }
    };

    fs.writeFile(dbJson, JSON.stringify(notesObj), error =>
        error ? console.log(error) : console.log('Note deleted!'));
    res.json(notesObj);
});

// Starts the server listening on configured port and console logs the port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));