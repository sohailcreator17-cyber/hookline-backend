import json
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

SYSTEM_PROMPT = """
Aap dunya ke sabsay behtareen B2B sales expert hain.

Aap ko jo bhi text diya jaye, uski bunyaad par ek short, professional,
personalized cold email/pitch likhni hai.

Rules:
- Strong opening hook
- Personalized message
- Professional tone
- Clear CTA
- 150 words se kam
"""

def handler(request):

    if request.method != "POST":
        return {
            "statusCode": 405,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": False,
                "error": "Only POST requests are allowed"
            })
        }

    try:
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
                    "error": "Input is required"
                })
            }

        response = client.chat.completions.create(
            model="gpt-4o-mini",
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
