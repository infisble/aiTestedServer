const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const IO_API_KEY = process.env.IO_API_KEY;
const IO_API_URL = 'https://api.intelligence.io.solutions/api/v1/';

app.get("/", (req, res) => {
  res.send("Hello from aiTestedServer!");
});

app.post('/api/enhance-text', async (req, res) => {
  const { text, systemPrompt } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ error: 'Text is empty' });
  }

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

    // 🔍 Логируем весь ответ от внешнего API
    console.log("🧠 Full AI API response:", JSON.stringify(data, null, 2));

    const content = data?.choices?.[0]?.message?.content;

    // Если content нет — логируем ошибку
    if (!content) {
      console.error("⚠️ Invalid or empty response from AI API.");
      return res.status(500).json({ error: 'AI did not return a valid response.' });
    }

    res.json({ result: content.trim() });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Failed to enhance text' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
