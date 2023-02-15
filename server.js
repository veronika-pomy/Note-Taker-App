// require express, path
const express = require('express');
const path = require ('path');
// require custom middleware
const { customLogger } = require('./middleware/customLogger.js');
// require router for notes
const api = require('./routes/notes.js');

const PORT = process.env.PORT || 3001

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(customLogger); // console log requests
app.use('/api', api);

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