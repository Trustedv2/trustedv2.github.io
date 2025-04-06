// server.js

const express = require('express');
const fetch = require('node-fetch'); // Using node-fetch for HTTP requests
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route to handle chat requests from frontend
app.post('/chat', async (req, res) => {
    const { message } = req.body; // The message sent from the frontend

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Make a request to OpenAI's API
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Your OpenAI API key
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // or any other model you're using
                messages: [{ role: 'user', content: message }] // Send user message to OpenAI
            })
        });

        const data = await response.json();

        // Handle if there is an error from OpenAI API
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        // Send the AI's response back to the frontend
        return res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Error interacting with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
