// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Öffnet (oder erstellt, falls noch nicht vorhanden) die Datenbank-Datei "todos.db"
const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Erstelle die Tabelle, falls sie noch nicht existiert
db.run(`CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value TEXT NOT NULL
)`);

// API Endpunkte

// Alle Todos abrufen
app.get('/todos', (req, res) => {
  db.all(`SELECT * FROM todos`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ todos: rows });
  });
});

// Neues Todo hinzufügen
app.post('/todos', (req, res) => {
  const { value } = req.body;
  if (!value) {
    return res.status(400).json({ error: "Value is required" });
  }
  db.run(`INSERT INTO todos(value) VALUES(?)`, [value], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, value });
  });
});

// Todo löschen
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM todos WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deletedID: id });
  });
});

// Todo aktualisieren (Editieren)
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  if (!value) {
    return res.status(400).json({ error: "Value is required" });
  }
  db.run(`UPDATE todos SET value = ? WHERE id = ?`, [value, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ updatedID: id, value });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
