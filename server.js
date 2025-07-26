const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 4000;
const FILE = './todos.json';

app.use(cors());
app.use(express.json());

// Load todos
app.get('/api/todos', (req, res) => {
  if (fs.existsSync(FILE)) {
    const data = fs.readFileSync(FILE, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

// Save todos
app.post('/api/todos', (req, res) => {
  fs.writeFileSync(FILE, JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 