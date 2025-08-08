
// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from your free API on Render!' });
});

app.get('/greet/:name', (req, res) => {
  res.json({ greeting: `Hello, ${req.params.name}!` });
});

app.get('/api/data', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ],
    time: new Date()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
