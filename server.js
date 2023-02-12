// require express & path
const express = require('express');
const path = require ('path');
// require router module
const api = require('./routes/index.js');
// require custom middleware
const { customLogger }= require('./middleware/customLogger.js');

const PORT = process.env.PORT || 3001

const app = express();

// custom middleware to console log requests
app.use(customLogger);

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use routes module
app.use('/api', api);

// middleware for serving static files in public folder
app.use(express.static('public'));

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

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT} 🚀`)
);