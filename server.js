// require express & path
const express = require('express');
const path = require ('path');
const fs = require('fs');

// require fs utilities modules
const { readJsonFile, writeJsonFile, appendJsonFile } = require('./helper/fsUtils');

// require uuid npm module to create a unique id for each note
const uuid = require('./helper/uuid');

// require custom middleware
const { customLogger } = require('./middleware/customLogger.js');

const PORT = process.env.PORT || 3001

const app = express();

// middleware for serving static files in public folder
app.use(express.static('public'));

// custom middleware to console log requests
app.use(customLogger);

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET Route to homepage
app.get('/', (req, res) =>
        res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route to notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// wildcard returns index.html (homepage)
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for reading and returning saved notes 
app.get('/api/notes', (req, res) => {
    // using fs untility to read from json file 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
      })  
});

// GET Route for a specific note by id
// app.get('api/notes/:id', (req, res) => {
//     const noteId = req.params.note_id;
//     readJsonFile('./db/db.json')
//       .then((data) => JSON.parse(data))
//       .then((json) => {
//         const result = json.filter((note) => note.note_id === noteId);
//         return result.length > 0
//           ? res.json(result)
//           : res.json('No note with that ID');
//       });
//   });

// POST Route for a new note ot be added to json file with saved notes
    // add unique id to each note 
app.post('/api/notes', (req, res) => {

    // destructure the requested obj first
    const { title, text } = req.body;

    // check that the note to be saved has a title before making a new note
    if (title) {
        const newNote = {
            title,
            text,
            // use npm module to create a unique id for each new note
            note_id: uuid(),
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
        res.status(500).json('Error in creating a new note');
    }
});

// DELETE Route for specific note by id
// app.delete('api/notes/:id', (req, res) => {
//     const noteId = req.params.note_id;
//     readJsonFile('./db/db.json')
//       .then((data) => JSON.parse(data))
//       .then((json) => {

//         // filter notes array and exclude the one to be deleted by id
//         const result = json.filter((note) => note.note_id !== noteId);
  
//         // write the new array to the json file 
//         writeJsonFile('./db/db.json', result);
  
//         // response
//         res.json(`Note with ID ${noteId} has been deleted 🗑️`);
//     });
// });

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT} 🚀`)
);