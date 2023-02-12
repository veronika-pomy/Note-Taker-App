// create new router obj for handling requests
const notes = require('express').Router();

// require fs utilities modules
const { readJsonFile, writeJsonFile, appendJsonFile } = require('../helper/fsUtils');

// require uuid npm module to create a unique id for each note
const uuid = require('../helper/uuid');

// require custom middleware
const { customLogger }= require('../middleware/customLogger.js');

// middleware
notes.use(customLogger);

// GET Route for reading and returning saved notes 
notes.get('/api/notes', (req, res) => {
    // using fs untility to read from json file 
    readJsonFile('../db/db.json')
    .then((data) => 
        res.json(JSON.parse(data)),
    );
});

// GET Route for a specific note by id
notes.get('api/notes/:_id', (req, res) => {
    const noteId = req.params.note_id;
    readJsonFile('../db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.note_id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No note with that ID');
      });
  });
  
// DELETE Route for specific note by id
notes.delete('api/notes/:_id', (req, res) => {
    const noteId = req.params.note_id;
    readJsonFile('../db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {

        // filter notes array and exclude the one to be deleted by id
        const result = json.filter((note) => note.note_id !== noteId);
  
        // write the new array to the json file 
        writeJsonFile('../db/db.json', result);
  
        // response
        res.json(`Note with ID ${noteId} has been deleted 🗑️`);
      });
  });
  
// POST Route for a new note ot be added to json file with saved notes
    // add unique id to each note 
notes.post('/api/notes', (req, res) => {

    // destructure the requested obj first
    const { title, text, note_id } = req.body;

    // check that the note to be saved has a title before making a new note
    if (title) {
        const newNote = {
            title,
            text,
            // use npm module to create a unique id for each new note
            note_id: uuid(),
        }

        // read json file and append a new note
        appendJsonFile(newNote, '../db/db.json');

        // check and return respone
        const response = {
            status: 'Note created successfully 👌',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in creating a new note');
    }
});

module.exports = notes;