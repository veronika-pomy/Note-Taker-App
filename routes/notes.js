const notes = require('express').Router();
// require fs, uuid, and helper json functions
const fs = require('fs');
const { writeJsonFile, appendJsonFile } = require('../helper/fsUtils');
const uuid = require('../helper/uuid');

// GET Route for reading and returning saved notes 
notes.get('/notes', (req, res) => {
    fs.readFile('./db/db.json','utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
});

// POST Route for a new note to be added to json file with saved notes
// adds unique id to each note 
notes.post('/notes', (req, res) => {

// destructure the requested obj first
const { title, text } = req.body;

// check that the note to be saved has a title and text before making a new note
if (title, text) {
    const newNote = {
        title,
        text,
        // use npm module to create a unique id for each new note
        id: uuid(),
    }

    // read json file and append a new note
    appendJsonFile(newNote, './db/db.json');

    // check and return respone
    const response = {
        status: 'Note created successfully 👌',
        body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
} else {
    res.status(500).json('Error in creating a new note ');
}
});

// DELETE Route for specific note by id
notes.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('./db/db.json','utf8',  (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let json = JSON.parse(data);

            // filter notes array and exclude the one to be deleted by id
            const result = json.filter((note) => note.id !== noteId);

            // write the new array to the json file 
            writeJsonFile('./db/db.json', result);

            // response
            res.json(`Note with ID ${noteId} has been deleted`);
        }
    });
});

module.exports = notes;
