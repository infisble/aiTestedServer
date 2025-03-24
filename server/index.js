from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Retrieve environment variables
IO_API_KEY = os.getenv('IO_API_KEY')
PORT = int(os.getenv('PORT', 10000))
IO_API_URL = 'https://api.intelligence.io.solutions/api/v1/chat/completions'

@app.route('/')
def home():
    return "Hello from aiTestedServer!"

@app.route('/api/enhance-text', methods=['POST'])
def enhance_text():
    data = request.json
    text = data.get('text', '').strip()
    system_prompt = data.get('systemPrompt', '')

    if not text:
        return jsonify({'error': 'Text is empty'}), 400

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {IO_API_KEY}',
    }
    payload = {
        'model': 'deepseek-ai/DeepSeek-R1',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': text}
        ],
        'temperature': 0.7,
        'max_tokens': 200,
    }

    try:
        response = requests.post(IO_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        enhanced_text = result.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
        return jsonify({'enhanced_text': enhanced_text})
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        return jsonify({'error': 'Failed to enhance text'}), 500

if __name__ == '__main__':
    app.run(port=PORT)
