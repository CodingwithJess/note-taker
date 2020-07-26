const fs = require("fs");
const express = require("express");
const path = require("path");

//express ports//
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

// global variables//
let notes = [];
let id;

const readNotes = () => {
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
  });
};

const writeNotes = () => {
  fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
  });
};

// HTML routes//
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname,"/public/notes.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"/public/index.html"));
});

//API route//
app.get("/api/notes", (req,res) => {
  readNotes();
  res.json(notes);
});

// POST-should save note on req.body and add it to db.json then return new note to the client
app.post("/api/notes", (req,res) => {
  newNote = req.body;
  id = notes.length + 1;
  newNote.id = id++;

  notes.push(newNote);

  writeNotes();
  console.log("New note was written to DB!")
  res.json(notes);
});

app.delete("/api.notes/:id", (req, res) => {
  var selectedID = parseInt(req.params.id);
  let selectedNote = notes.find(note => note.id === selectedID);

  notes.splice(notes.indexOf(selectedNote), 1);

  writeNotes();
  console.log("Note was deleted from DB.")

  readNotes(); 

  res.json(selectedNote);
})


app.listen(PORT, () => {
  readNotes();
  console.log("App listening on PORT" + PORT);
});