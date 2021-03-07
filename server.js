const express = require('express');
const fs = require('fs');
const path = require('path');
const noteData = require('./db/db.json');
var uniqid = require('uniqid');


// Here we are selecting the port to use for the application
const PORT = process.env.PORT || 3000;


// Below is the express application
const app = express();


app.use(express.static('public'));

//This ensures our code runs as json so it can be understood when moving between front and back end
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//This 'gets' the request and send the user to the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
// this then send the user to the notes page once they 'get' the button click
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});



//The below function adds the note written to the database
noteAdded = (notes) => {
    // This ensures the note is a string.
    notes = JSON.stringify(notes);

    console.log(notes);
    // This sends the note, or string, to the db file where these will be kept.
    fs.writeFile("./db/db.json", notes, (err) => {
        if (err) {
            return console.log(err);
        }
        else {
            console.log('Your note has been successfully added!')
        }
    });
}

// The below will get the data and return it to the notes on the page
app.get("/api/notes", (req, res) => {
    res.json(noteData);
});

// The method below "posts" pushes the not to the page
app.post("/api/notes", (req, res) => {
    // each note requires a unique id code
    var postNotes = req.body;
    // uniqid will generate a unique id for each note added
    postNotes.id = uniqid();
    console.log("req.body.id: " + postNotes);
    // this will "push" the note and all of the information to the page
    noteData.push(postNotes);
    noteAdded(noteData);
    // this ensures that the data stays in json format
    res.json(noteData);
});

// The below method will delete specific notes based on the IDs
app.delete("/api/notes/:id", (req, res) => {
    // this will take in the id of the note and turn it into a string
    const noteID = req.params.id;
    console.log(noteID);
    // The below loop
    for (let i = 0; i < noteData.length; i++) {
        if (noteData[i].id == noteID) {
            noteData.splice(i, 1);
            console.log(noteData);
            console.log("This has been successfully deleted!")
            break;
        }
    }
    

    noteAdded(noteData);

    res.json(noteData);
});


//=================================================================
// Start the server to listen to the request
app.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));