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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
