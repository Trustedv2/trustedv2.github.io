const express = require('express');
const fetch = require('node-fetch'); // For API requests to OpenAI
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Route to handle OpenAI API calls
app.post('/api/generate', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        // Make a request to OpenAI API with the provided prompt
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Using the API key from the .env file
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Ensure correct model is selected
                prompt: prompt,
                max_tokens: 100
            })
        });

        const data = await response.json(); // Get the response data from OpenAI
        res.json(data); // Send the data back to the frontend
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
});

// Set the port for the server to listen on (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});