const express = require('express');
const fs = require('fs');
const path = require('path');
const notesObj = require('./db/db');
const dbJson = path.join(__dirname, './db/db.json');

const app = express();
const PORT = process.env.PORT || 3000;
