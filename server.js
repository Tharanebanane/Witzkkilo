const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const apiKey = 'DEIN_API_KEY_HIER';

app.use(express.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150,
        }),
    });

    const data = await response.json();
    res.json(data.choices[0].message.content);
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
