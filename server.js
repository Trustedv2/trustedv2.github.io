const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test route to confirm server is working
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Route for interacting with ChatGPT
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Send message to OpenAI API (ChatGPT)
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your actual OpenAI API key
          'Content-Type': 'application/json',
        },
      }
    );

    // Send response back to the frontend
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    res.status(500).json({ error: 'Failed to get a response from ChatGPT' });
  }
});

// Start the server




const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Middleware to serve static files and parse JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory users data (for demo purposes, use a database in production)
let users = [];

// Sign up route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Basic checks
    if (!username || !password) {
        return res.json({ success: false, message: "Username and password cannot be blank!" });
    }

    if (password.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters!" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.json({ success: true, message: "Account created successfully!" });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.json({ success: false, message: "User not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.json({ success: false, message: "Incorrect password!" });
    }

    res.json({ success: true, message: "Logged in successfully!" });
});

// Profile page (for logged-in users)
app.get('/profile', (req, res) => {
    if (users.length === 0) {
        return res.send('<h1>Please log in first!</h1>');
    }
    res.send(`
        <h1>Welcome, ${users[0].username}!</h1>
        <a href="/">Logout</a>
    `);
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
