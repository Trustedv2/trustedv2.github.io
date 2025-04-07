const express = require('express');
const fetch = require('node-fetch'); // Use node-fetch for making HTTP requests
const dotenv = require('dotenv');
dotenv.config(); // Load API key from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// POST route to handle chat
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const reply = data.choices[0].message.content;
        return res.json({ reply });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
