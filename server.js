const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // if you're calling the OpenAI API

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors()); // This will allow all domains, or specify a specific one (e.g., 'http://localhost:8080')

// Parse incoming JSON payloads
app.use(bodyParser.json());

// POST route for interacting with OpenAI API or logic
app.post('/chat', async (req, res) => {
    const { message } = req.body;  // Extract the message from the request body

    // Check if the message exists
    if (!message) {
        return res.status(400).json({ reply: 'No message provided' });
    }

    try {
        // Example: Call OpenAI API or another external service to process the message
        // Replace with your OpenAI API call, assuming you use fetch or another method
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Use your OpenAI API key
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Or your desired model
                messages: [{ role: 'user', content: message }],
            }),
        });

        const data = await response.json();
        
        // Check for OpenAI API errors
        if (!response.ok || !data.choices || data.choices.length === 0) {
            throw new Error('Failed to get a valid response from OpenAI');
        }

        // Send back the reply to the frontend
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ reply: 'Sorry, something went wrong. Please try again.' });
    }
});

// Handle root or any other routes
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
