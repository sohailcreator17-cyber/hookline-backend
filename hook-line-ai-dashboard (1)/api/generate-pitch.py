import os
import json
from groq import Groq

client = Groq(
    api_key=os.environ.get("OPENAI_API_KEY")
)

SYSTEM_PROMPT = """
Aap dunya ke sabsay behtareen B2B sales expert hain.

Aap ko jo bhi text diya jaye, us company ka analysis karna hai aur
ek short, punchy, personalized cold email/pitch likhni hai.

Rules:
- Personalized ho
- Professional ho
- Strong opening hook ho
- Clear CTA ho
- 150 words se kam ho
"""

def handler(request):
    try:
        # Sirf POST allow karein
        if request.method != "POST":
            return {
                "statusCode": 405,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "error": "Method not allowed"
                })
            }

        # Request body parse karein
        body = request.get_json() or {}

        user_input = body.get("input", "").strip()

        if not user_input:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "error": "Input field is required"
                })
            }

        # Groq API call
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ],
            temperature=0.7,
            max_tokens=300
        )

        pitch = response.choices[0].message.content

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": True,
                "pitch": pitch
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": False,
                "error": str(e)
            })
        }
