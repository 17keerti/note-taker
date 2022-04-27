const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid');
const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(JSON.parse(data));
      res.json(JSON.parse(data));
    }
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.post('/api/notes', (req, res) => {
  console.log(req.body);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting review');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);