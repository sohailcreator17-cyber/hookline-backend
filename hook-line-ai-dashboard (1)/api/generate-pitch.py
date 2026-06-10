import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/generate-pitch', methods=['POST'])
def generate_pitch():
    try:
        # Vercel settings se aap ki Groq key uthaye ga
        api_key = os.environ.get("OPENAI_API_KEY")
        
        data = request.get_json()
        user_input = data.get('text', '') or data.get('input', '')

        # Direct Groq AI ke muft server ka rasta
        url = "https://groq.com"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": "Aap dunya ke sabsay behtareen B2B sales expert hain. Aap ko jo bhi text diya jaye, aap ne us company ki kamiyan dhoondni hain aur ek aisi short, punchy cold email/pitch likhni hai jise parh kar response rate 20% se zyada aaye. Respond inside a clean string format."
                },
                {
                    "role": "user",
                    "content": f"Prospect Details: {user_input}"
                }
            ]
        }

        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        
        # Groq se aaya hua muft text result
        ai_text = response_data['choices'][0]['message']['content']
        return jsonify({"text": ai_text, "pitch": ai_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
