const fs = require("fs");
const express = require("express");
const path = require("path");
const { allowedNodeEnvironmentFlags } = require("process");

//express ports//
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

// global variables//
let notes = [];
let id = [];

const readNotes = () => {
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
  });
};

// HTML routes//
app.get("/notes", function (req, res){
  res.sendFile(path.join(__dirname,"/public/notes.html"));
});

app.get("*", function (req, res){
  res.sendFile(path.join(__dirname,"/public/index.html"));
});

//API route//
app.get("/api/notes", function(req,res){
  readNotes();
  return res.json(notes);
});

app.listen(PORT, function (){
  readNotes();
  console.log("App listening on PORT" + PORT);
})