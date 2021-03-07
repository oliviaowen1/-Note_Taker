const express = require('express');
const fs = require('fs');
const path = require('path');
const notesFile = require('./db/db');
const dbJson = path.join(__dirname, './db/db.json');
const uniqid = require('uniqid');

// This sets up our server and express app
const app = express();
const PORT = process.env.PORT || 3000;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));
app.get('/assets/js/index.js', (req, res) => res.sendFile(path.join(__dirname, './public/assets/js/index.js')));
app.get('/assets/css/styles.css', (req, res) => res.sendFile(path.join(__dirname, './public/assets/css/styles.css')));

app.post('/api/notes', (req, res) => {
    //adds new input to request body
    const newNote = req.body;
    newNote.id = uniqid();
    //logs newest input
    console.log(newNote);

    //gets old inputs
    var db = require("./db/db.json");

    //adds new note
    db.push(newNote);

    //shows current notes
    console.log(db);

    //stringifys
    const writeFile = JSON.stringify(db, null, 2);

    //adds to db.json
    generateNotes(writeFile);

    //loads notes
    return res.json(db);

});

app.delete('/api/notes/:id', (req, res) => {
    //adds new input to request body
    const selectedNote = req.params.id;

    //logs newest input
    console.log(selectedNote);

    //gets old inputs
    var db = require("./db/db.json");

    for (let i = 0; i < db.length; i++) {
        if (selectedNote == db[i].id) {
            console.log(db[i]);
            db.splice(i, 1);
        }
    }

    //shows current notes
    console.log(db);

    //stringifys
    const writeFile = JSON.stringify(db, null, 2);

    //adds to db.json
    deletedNotes(writeFile);
    //reloads notes
    return res.json(db);
});

//recreates notes file after adding a note
function generateNotes(notes) {
    fs.writeFile("./db/db.json", notes, (err) =>
        err ? console.error(err) : console.log('New note added successfully!'));
}

//recreates notes file after deleting a note
function deletedNotes(notes) {
    fs.writeFile("./db/db.json", notes, (err) =>
        err ? console.error(err) : console.log('Note deleted successfully!'));
}

//Console logs active port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));