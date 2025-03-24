
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const IO_API_KEY = process.env.IO_API_KEY;
const IO_API_URL = 'https://api.intelligence.io.solutions/api/v1/';

app.post('/api/enhance-text', async (req, res) => {
  const { text, systemPrompt } = req.body;

  if (!text?.trim()) return res.status(400).json({ error: 'Text is empty' });

  try {
    const response = await fetch(IO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${IO_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: 200,
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    res.json({ result: content?.trim() || text });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to enhance text' });
  }
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
