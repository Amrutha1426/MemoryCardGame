const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 5000;

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password if any
  database: 'game_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    process.exit(1);
  }
  console.log('✅ MySQL connected');
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API: Save game result
app.post('/save-score', (req, res) => {
  const { playerName, score, attempts } = req.body;

  if (!playerName || score === undefined || attempts === undefined) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const query = 'INSERT INTO memory_game_scores (player_name, score, attempts) VALUES (?, ?, ?)';
  db.query(query, [playerName, score, attempts], (err, result) => {
    if (err) {
      console.error('Error saving score:', err);
      return res.status(500).json({ message: 'Error saving score' });
    }
    res.status(200).json({ message: 'Score saved successfully!' });
  });
});

// API: Fetch Top 10 High Scores
app.get('/high-scores', (req, res) => {
  const query = 'SELECT player_name, score, attempts FROM memory_game_scores ORDER BY score DESC, attempts ASC LIMIT 10';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching scores:', err);
      return res.status(500).json({ message: 'Error fetching high scores' });
    }
    res.status(200).json(results);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
