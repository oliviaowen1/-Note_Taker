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


app.use(express.static(__dirname + '/public'));

