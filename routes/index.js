const express = require('express');

// import modular route for notes 
const notesRouter = require('./notes.js');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;